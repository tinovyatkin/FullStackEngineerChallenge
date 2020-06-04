# Full Stack Developer Challenge ![CI](https://github.com/tinovyatkin/FullStackEngineerChallenge/workflows/CI/badge.svg?branch=master)

## Intro

This is my code implementation as a solution to this dev challenge. The App is split into to folders: [`api`](api/) and [`frontend`](frontend/).

## The API

API server implemented on lightweight Koa.JS framework with MongoDB as database layer. Pure JavaScript with JSDoc typings, targeting Node 14.
Functional tests implemented via Mocha framework, with native V8 code coverage reported by `c8`.
MongoDB data consistency is enforced by natively supported [JSON schemas](api/src/schemas/)

Authorization is JWT based.
All GET endpoints providing pagination, limiting and sorting parameters.

- API
  - unauthorized
    - [x] POST /login - login endpoint
  - employee
    - [x] GET /employees/feedback - List of performance reviews requiring feedback
  - admin
    - [x] GET /admin/employees - get employee list
    - [x] POST /admin/employees - create an employee
    - [x] DELETE /admin/employees/:employee_email - delete an employee
    - [x] PUT /admin/reviews/:employee_email - assign an employee for another employee performance review

Run tests:

```sh
cd api
npm install
npm test
```

## Frontend

This is Vue.js application via Nuxt.js framework, utilizing Vuex as store, Vue-router for navigation and Vuetify (Material Design) for UI and reusable components. Written in TypeScript.
Implemented authorization logic, admin dashboard for viewing and removing employees with server-side data pagination and sorting supported.
Implemented employee logic to see assigned reviews.
Base foundation for unit tests via Jest and project localization.

## DevOps

### Docker environment

There is a simply way to see the project live via pre-configured Docker container,
just run:

`make`

it will build the container with MongoDB and some mock data and test user accounts as well as mapped folders with full hot-reload support. Then open [http://localhost:9999](http://localhost:9999) in a browser once docker build finished.

To cleanup:

`make clean`

### CI

The project have continuous integration setup via GitHub Actions, that lints files changed in current Pull Request (current setup includes linting for JavaScript, TypesScript, Makefile, Yaml and Dockerfile) and runs appropriate test suites with coverage reporting.

You may see [test run here](https://github.com/tinovyatkin/FullStackEngineerChallenge/pull/1) or [here](https://github.com/tinovyatkin/FullStackEngineerChallenge/pull/2).
