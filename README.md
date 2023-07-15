# AMRIT - Helpline1097 Service

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) ![build status](https://github.com/PSMRI/Helpline1097-UI/actions/workflows/sast-and-package.yml/badge.svg)

The AMRIT Helpline1097 service aims to provide comprehensive support to individuals and families affected by AIDS, offering a range of services to effectively address their needs.

## Features

- **National Helpline (1097):** The service operates as a national helpline for AIDS-related issues, providing counseling and care to individuals and families affected by AIDS. It supports both inbound and outbound calls.

- **Actors:** The helpline involves two main actors: the counseling officer (CO) and the supervisor. The CO is responsible for providing information, counseling, and referrals to callers seeking help, while the supervisor oversees the helpline's operations.

- **Comprehensive Support:** The helpline offers several services, including:

  - **Information Service:** Providing AIDS-related information such as prevention methods, treatment options, and available support services.
  
  - **Counseling Service:** Offering callers the opportunity to speak with trained professionals who provide emotional support, guidance, and address their concerns.
  
  - **Referral Service:** Connecting callers with relevant healthcare providers, support groups, or organizations that can offer further assistance.
  
  - **Feedback System:** Incorporating a feedback mechanism, allowing callers to provide feedback on their experience with the helpline, helping to improve the quality of support provided.

- **Integration with Everwell System:** The helpline is integrated with the Everwell system. It accesses a list of beneficiaries who have missed medication doses for AIDS treatment. The helpline initiates outbound calls to these beneficiaries, collecting accurate information about missed doses, including medicine type, dosage instructions, phone numbers, and alternate phone numbers. Additionally, it inquires about the reasons behind missed doses. The updated data is then pushed back to the Everwell system, ensuring up-to-date information about beneficiaries and their medication adherence.

## Building from source

To build the Helpline1097 microservice from source, follow these steps:

### Prerequisites

Ensure that the following prerequisites are met before building the 1097 service:

* JDK 1.8
* Maven
* NPM/YARN
* Spring Boot v2
* MySQL

### Installation

To install the 1097 module, please follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies and build the module:
   - Run the command `npm install`.
   - Run the command `npm run build`.
   - Run the command `mvn clean install`.
   - Run the command `npm start`.
3. Open your browser and access `http://localhost:4200/#/login` to view the login page of module.

## Configuration
The 1097 module can be configured by editing the config.js file. This file contains all of the settings for the module, such as the database connection string, the user authentication mechanism, and the role hierarchy.

## Usage

All the features of the 1097 service are exposed as REST endpoints. Please refer to the Swagger API specification for detailed information on how to utilize each feature.

The 1097 module offers comprehensive management capabilities for your application.

<!-- # Iemrdash

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
-->
