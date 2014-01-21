require.config({
  baseUrl: '/',
  paths: {
    chai: 'lib/chai/chai',
    sinon: 'lib/sinonjs/sinon',
    'sinon-chai': 'lib/sinon-chai/lib/sinon-chai'
  },
  packages: [
    {
      name: 'scriptloader',
      location: 'src/javascript',
      main: 'scriptloader'
    }
  ],
  shim: {
    'sinon': {
      exports: 'sinon'
    }
  }
});
