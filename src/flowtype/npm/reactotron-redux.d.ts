declare module 'reactotron-redux' {
    declare module.exports: any;
  }
  
  /**
   * We include stubs for each file inside this npm package in case you need to
   * require those files directly. Feel free to delete any files that aren't
   * needed.
   */
  declare module 'reactotron-redux/dist/index' {
    declare module.exports: any;
  }
  
  // Filename aliases
  declare module 'reactotron-redux/dist/index.js' {
    declare module.exports: $Exports<'reactotron-redux/dist/index'>;
  }