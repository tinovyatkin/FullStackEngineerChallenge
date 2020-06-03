# Full Stack Developer Challenge

## Intro

This is my code implementation as a solution to this dev challenge. The App is split into to folders: [`api`](api/) and [`frontend`](frontend/).

## The API

API server implemented on lightweight Koa.JS framework with MongoDB as database layer. Pure JavaScript with JSDoc typings, targeting Node 14.
Functional tests implemented via Mocha framework, with native V8 code coverage reported by `c8`: run `npm test` in the `api` folder.
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

## Frontend

This is Vue.js application via Nuxt.js framework, utilizing Vuex as store, Vue-router for navigation and Vuetify (Material Design) for UI and reusable components.
Implemented authorization logic, admin dashboard for viewing and removing employees with server-side data pagination and sorting supported.
Implemented employee logic to see assigned reviews.
Base foundation for unit tests via Jest and project localization.

## Docker environment

There is a simply way to see the project live via pre-configured Docker container,
just run:

`make`

it will build the container with MongoDB and some mock data as well as mapped folders with full hot-reload support. Then open `http://localhost:9999` in a browser.

To cleanup:

`make clean`
