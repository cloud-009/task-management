# TaskManagement

This project stimualates the task management between multiple users, allowing them to create, read, update and delete the task.

## Development server

>Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

>Run `json-server --watch task.json` which will run the json-server used to store the task users creates or performs any other action to it.

Navigate to `home` page(default route), where you can click on `3 dots`, which enables you to perform actions such as View/Edit (or) Delete task.

Edit provide the user to edit the task, also user can mark the task as completed. Which updates in the `home` page.

This application has dependency with `sweetalert`, which is used to show toast messages to the user.

Also dependency with `ng-http-loader`, to show the loader while creating a http call.

## Running unit tests

Run `ng test` to execute the unit tests via Karma test runner.

Also, you can run `ng test --code-coverage` to see the coverage of the test cases. (covered 91% overall)


