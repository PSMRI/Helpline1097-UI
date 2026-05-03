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
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { FeedbackPublicPageComponent } from "./pages/feedback-public-page/feedback-public-page-component";
import { FeedbackDialogComponent } from "./shared/feedback-dialog/feedback-dialog.component";

import { FeedbackService } from "./services/feedback.service";

import { MaterialModule } from "../material.module";

@NgModule({
  declarations: [FeedbackPublicPageComponent, FeedbackDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
  ],
  exports: [FeedbackDialogComponent, FeedbackPublicPageComponent],
  providers: [FeedbackService],
})
export class FeedbackModule {}