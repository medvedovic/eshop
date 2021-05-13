declare module "csstype" {
  interface Properties {
    // allow css properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
  }
}
