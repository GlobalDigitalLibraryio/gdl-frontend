// flow-typed signature: 382086d92ff0846c694ebb50acc61313
// flow-typed version: 0acaeda7c1/cookie-dough_v0.x.x/flow_>=v0.25.x

declare module "cookie-dough" {
  declare module.exports: (
    req: ?Object
  ) => {
    set: (name: string, value: string, options: ?Object) => string,

    get: (name: string) => ?string,

    remove: (name: string, options: ?Object) => boolean,

    all: () => Object
  };
}

declare module "cookie-dough/index" {
  declare module.exports: $Exports<"cookie-dough">;
}

declare module "cookie-dough/index.js" {
  declare module.exports: $Exports<"cookie-dough">;
}
