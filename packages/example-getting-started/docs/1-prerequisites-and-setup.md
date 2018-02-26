## Setup

Before we can begin, you'll need to make sure you have some things installed:
- [Node.js](https://nodejs.org/en/) at v8.x or greater

Additionally, this tutorial assumes that you are comfortable with
certain technologies, languages and concepts.
- JavaScript (ES6)
- [npm](https://www.npmjs.com/)
- [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)


Lastly, you'll need to install the LoopBack 4 CLI toolkit:
```
npm i -g @loopback/cli
```

If you'd like to continue the tutorial, then move to the
[Create your app scaffolding](2-scaffold-app.md) section.

If you'd like to see the final results of this tutorial as an example
application, follow these steps:

1. Run the `lb4 example` command to select and clone the getting-started repository:
```
$ lb4 example
? What example would you like to clone? (Use arrow keys)
❯ getting-started: An application and tutorial on how to build with LoopBack 4.
  hello-world: A simple hello-world Application using LoopBack 4
  log-extension: An example extension project for LoopBack 4
  rpc-server: A basic RPC server using a made-up protocol.
```

2. Jump into the directory and then install the required dependencies:
```
$ cd loopback4-example-getting-started && npm i
```

3. Finally, start the application!
```
$ npm start

Server is running on port 3000
```

Feel free to look around in the application's code to get a feel for how it
works, or if you're still interested in learning how to build it step-by-step,
then continue with this tutorial!

### Navigation

Next step: [Scaffolding your application](2-scaffold-app.md)
