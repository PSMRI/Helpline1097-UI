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
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

export type ServiceLine = "1097" | "104" | "AAM" | "MMU" | "TM" | "ECD";

export interface CategoryDto {
  categoryID: string;
  slug: string;
  label: string;
  scope: "GLOBAL" | ServiceLine;
  active: boolean;
}

export interface SubmitFeedbackRequest {
  rating: number;
  categorySlug: string; // FE sends slug; BE resolves to CategoryID
  comment?: string;
  isAnonymous: boolean; // true for logout flow
  serviceLine: ServiceLine;
  // userId?: number | string; // optional when identified
}

@Injectable()
export class FeedbackService {
  private readonly apiBase = (window && window.location ? window.location.origin : "") + "/common-api";

  constructor(private http: Http) {}

  listCategories(serviceLine: ServiceLine): Observable<CategoryDto[]> {
    const url = this.apiBase + "/platform-feedback/categories?serviceLine=" +
      encodeURIComponent(serviceLine || "");
    return this.http.get(url)
      .map((res: Response) => res.json() as CategoryDto[])
      .catch((err: any) => Observable.throw(err || "Server error"));
  }

  submitFeedback(payload: SubmitFeedbackRequest): Observable<{ id: string; createdAt?: string }> {
    const url = this.apiBase + "/platform-feedback";
    const headers = new Headers({ "Content-Type": "application/json" });
    const options = new RequestOptions({ headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err || "Server error"));
  }
}