### Putting it all together

We've got all of our artifacts now, and all that's left is to bind them to our
[Application](http://loopback.io/doc/en/lb4/Application.html) so that LoopBack's
[Dependency injection](http://loopback.io/doc/en/lb4/Dependency-injection.html)
system can tie it all together for us!

LoopBack's
[boot module](https://github.com/strongloop/loopback-next/tree/master/packages/boot)
will automatically discover our controllers, repositories, datasources and
other artifacts and inject them into our application for use.
In the current example, we've manually loaded our repository so that it can be
mocked/stubbed for unit testing purposes.

>**NOTE**: The boot module will only discover and inject artifacts that
follow our established conventions for artifact directories. Here are some
examples:
>* Controllers: `./src/controllers`
>* Datasources: `./src/datasources`
>* Models: `./src/models`
>* Repositories: `./src/repositories`

#### src/application.ts
```ts
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {TodoRepository} from './repositories';
import {db} from './datasources/db.datasource';

/* tslint:disable:no-unused-variable */
// Do not remove!
// Class and Repository imports required to infer types in consuming code!
// Binding and Booter imports are required to infer types for BootMixin!
import {BootMixin, Booter, Binding} from '@loopback/boot';
import {
  Class,
  Repository,
  DataSourceConstructor,
  RepositoryMixin,
} from '@loopback/repository';
/* tslint:enable:no-unused-variable */

export class TodoApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options?: ApplicationConfig) {
    super(options);
    this.projectRoot = __dirname;
    this.setupRepositories();
  }

  // Helper functions (just to keep things organized)
  setupRepositories() {
    const datasource =
      this.options && this.options.datasource
        ? new DataSourceConstructor(this.options.datasource)
        : db;
    this.bind('datasource').to(datasource);
    this.repository(TodoRepository);
  }
}}
```

### Try it out

Let's try out our application!
First, you'll want to start the app.
```
$ npm start
Server is running on port 3000
```

Next, you can use the [API Explorer](http://loopback.io/api-explorer/?url=http://localhost:3000/swagger.json) to browse your API and make requests!

Here are some requests you can try:
- `POST /todo` with a body of `{ "title": "get the milk" }`
- `GET /todo/{id}` using the ID you received from your `POST`, and see if you
get your Todo object back.
- `PATCH /todo/{id}` with a body of `{ "desc": "need milk for cereal" }`

That's it! You've just created your first LoopBack 4 application!

### More examples and tutorials

Eager to continue learning about LoopBack 4? Check out our
[examples and tutorials](https://loopback.io/doc/en/lb4/Examples-and-tutorials.html)
section to find examples for creating your own custom components, sequences and
more!

### Navigation

Previous step: [Add a controller](7-controller.md)
