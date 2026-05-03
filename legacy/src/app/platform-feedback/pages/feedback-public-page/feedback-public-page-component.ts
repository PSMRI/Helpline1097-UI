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
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import 'rxjs/add/operator/map';

type SL = "1097" | "104" | "AAM" | "MMU" | "TM" | "ECD";

@Component({
  selector: 'app-feedback-public-page',
  templateUrl: './feedback-public-page-component.html',
  styleUrls: ['./feedback-public-page-component.css']
})
export class FeedbackPublicPageComponent {
  serviceLine: SL = "104"; // default fallback

  constructor(private route: ActivatedRoute) {
    // Check query param ?sl=
    this.route.queryParamMap
      .map((q) => (q.get("sl") as SL) || this.detectFromLocation())
      .subscribe((sl) => (this.serviceLine = sl));
  }

  private detectFromLocation(): SL {
    const path = window.location.pathname.toLowerCase();

    // path-based service lines
    if (path.includes("/1097")) return "1097";
    if (path.includes("/104")) return "104";
    if (path.includes("/aam")) return "AAM";
    if (path.includes("/mmu")) return "MMU";
    if (path.includes("/tm")) return "TM";
    if (path.includes("/ecd")) return "ECD";

    // fallback
    return "AAM";
  }
}