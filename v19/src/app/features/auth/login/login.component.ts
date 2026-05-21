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

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    userID: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  private readonly SALT = 'RandomInitVector';
  private readonly KEY_IV = 'Piramal12Piramal';
  private readonly _keySize = 256;
  private readonly _ivSize = 128;
  private readonly _iterationCount = 1989;

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { userID, password } = this.loginForm.value;
    
    try {
      const encryptedPassword = this.encryptLegacyPassword(this.KEY_IV, password!);
      
      console.log('Login Payload prepared:', { userID, encryptedPassword });
      
      setTimeout(() => {
        this.isLoading.set(false);
        this.errorMessage.set('UI Milestone reached! Password successfully encrypted using legacy PBKDF2/AES logic. Ready for API hookup.');
      }, 1500);

    } catch (err) {
      this.errorMessage.set('An error occurred during authentication processing.');
      this.isLoading.set(false);
    }
  }

  private encryptLegacyPassword(passPhrase: string, plainText: string): string {
    const iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    const salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(CryptoJS.enc.Hex);
    
    const key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA512,
      keySize: this._keySize / 32,
      iterations: this._iterationCount
    });

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });

    const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    
    return salt + iv + ciphertext;
  }
}
