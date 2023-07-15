import os

def add_license_text(directory_path, license_text):
    count = 0

    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            file_extension = os.path.splitext(file)[1][1:]
            if file_extension in ["js", "ts"]:
                add_license_text_to_file(file_path, license_text)
                count += 1

    print(f"License text added successfully to {count} files.")

def add_license_text_to_file(file_path, license_text):
    with open(file_path, "r+") as file:
        content = file.read()
        file.seek(0, 0)
        file.write(license_text + "\n\n" + content)

if __name__ == "__main__":
    directory_path = "/home/goldensunrise/Downloads/vidya-psmri-github/ui/Helpline1097-UI"
    
    license_text = """\
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
"""

    add_license_text(directory_path, license_text)

