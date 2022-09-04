import utils from './services/utils';

declare module 'vue' {
  interface ComponentCustomProperties {
    $utils: typeof utils    
  }
}
