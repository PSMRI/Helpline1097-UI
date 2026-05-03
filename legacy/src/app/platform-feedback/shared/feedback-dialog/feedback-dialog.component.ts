/*
 * AMRIT – Accessible Medical Records via Integrated Technology
 * Integrated EHR (Electronic Health Records) Solution
 *
 * Copyright (C) "Piramal Swasthya Management and Research Institute"
 *
 * This file is part of AMRIT.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  FeedbackService,
  ServiceLine,
  CategoryDto,
} from "../../services/feedback.service";
import 'rxjs/add/operator/finally';
import { sessionStorageService } from 'app/services/sessionStorageService/session-storage.service';
import { HttpServices } from "app/services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css'],
})
export class FeedbackDialogComponent implements OnInit {
  @Input() serviceLine: ServiceLine = "TM";
  @Input() defaultCategorySlug?: string;

  stars = [1, 2, 3, 4, 5];
  starLabels = ["Terrible", "Bad", "Okay", "Good", "Great"];
  categories: CategoryDto[] = [];
  submitting = false;
  error?: string;
  successId?: string;

  isLoggedIn = false;
  storedUserId?: string;

  // showCategory controls whether dropdown is shown (true if categories loaded)
  showCategory = true;

  form = this.fb.group({
    rating: [0, [Validators.min(1), Validators.max(5)]],
    categorySlug: ["", Validators.required],
    comment: ["", Validators.maxLength(2000)],
    // default to true for logged-out; we'll set actual default in ngOnInit
    isAnonymous: [true],
  });
  current_language_set: any;

  constructor(
    private fb: FormBuilder,
    private api: FeedbackService,
    private sessionStorage: sessionStorageService,
    public httpService: HttpServices,
    public router: Router,
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // sessionStorage check
    try {
      this.storedUserId = this.sessionStorage.getItem("userID") || undefined;
      this.isLoggedIn = !!this.storedUserId;
    } catch (e) {
      // sessionStorage may be unavailable in some runners; fail safe to anonymous
      this.isLoggedIn = false;
      this.storedUserId = undefined;
    }

    // If user is logged in, default to NOT anonymous so they explicitly can opt-in; if logged out, force anonymous
    if (this.isLoggedIn) {
      // default to anonymous=true to respect privacy; but you asked to ask consent — show unchecked by default
      // we'll set it to true so users must actively uncheck to identify themselves OR you can flip to false to encourage identified
      // choose default = true to be conservative:
      this.form.controls.isAnonymous.setValue(true);
    } else {
      this.form.controls.isAnonymous.setValue(true);
    }

    // load categories
    this.api.listCategories(this.serviceLine).subscribe({
      next: (list) => {
        this.categories = (list || []).filter(
          (c: any) => (c as any).active || true
        );
        this.showCategory = this.categories.length > 0;
        const def = this.categories[0].slug || this.defaultCategorySlug || "";
        if (def) this.form.controls.categorySlug.setValue(def);
      },
      error: () => (this.error = "Could not load categories."),
    });
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  setRating(n: number) {
    this.form.controls.rating.setValue(n);
  }

  toggleAnonymous(event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.controls.isAnonymous.setValue(input.checked);
  }

  formInvalidForNow(): boolean {
    // require rating >=1 and category selected
    return this.form.invalid;
  }

  login() {
    this.router.navigate(["/"]);
  }

  submit() {
    this.error = undefined;
    this.successId = undefined;

    if (this.formInvalidForNow()) {
      this.error = "Pick a rating and a category.";
      return;
    }

    // build payload
    const payload: any = {
      rating: this.form.value.rating!,
      categorySlug: this.form.value.categorySlug!,
      comment: this.form.value.comment || undefined,
      isAnonymous: this.form.value.isAnonymous!,
      serviceLine: this.serviceLine,
    };

    if (!payload.isAnonymous && this.isLoggedIn && this.storedUserId) {
      // include userId for identified submissions
      // session storage stores as string, convert to integer if needed by backend
      const parsed = parseInt(this.storedUserId as string, 10);
      payload.userId = Number.isNaN(parsed) ? this.storedUserId : parsed;
    }

    this.submitting = true;
    this.api
      .submitFeedback(payload)
      .finally(() => (this.submitting = false))
      .subscribe({
        next: (res) => {
          this.successId = res.id || "submitted";
          // reset form but keep identity default
          this.form.reset({
            rating: 0,
            categorySlug: this.categories[0].slug || "",
            comment: "",
            isAnonymous: this.isLoggedIn ? true : true,
          });
        },
        error: (e) => {
          if (e.status === 429) {
            this.error = "Too many attempts. Try later.";
          } else if (e.error.error) {
            this.error = e.error.error;
          } else {
            this.error = "Submission failed.";
          }
        },
      });
  }
}
