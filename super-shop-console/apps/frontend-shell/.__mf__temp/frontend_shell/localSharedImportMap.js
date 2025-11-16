
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@super-shop/theme": async () => {
          let pkg = await import("__mf__virtual/frontend_shell__prebuild___mf_0_super_mf_2_shop_mf_1_theme__prebuild__.js");
            return pkg;
        }
      ,
        "@super-shop/ui": async () => {
          let pkg = await import("__mf__virtual/frontend_shell__prebuild___mf_0_super_mf_2_shop_mf_1_ui__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/frontend_shell__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/frontend_shell__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "react-router-dom": async () => {
          let pkg = await import("__mf__virtual/frontend_shell__prebuild__react_mf_2_router_mf_2_dom__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@super-shop/theme": {
            name: "@super-shop/theme",
            version: "0.1.0",
            scope: ["default"],
            loaded: false,
            from: "frontend_shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@super-shop/theme"}' must be provided by host`);
              }
              usedShared["@super-shop/theme"].loaded = true
              const {"@super-shop/theme": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^0.1.0",
              
            }
          }
        ,
          "@super-shop/ui": {
            name: "@super-shop/ui",
            version: "0.1.0",
            scope: ["default"],
            loaded: false,
            from: "frontend_shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@super-shop/ui"}' must be provided by host`);
              }
              usedShared["@super-shop/ui"].loaded = true
              const {"@super-shop/ui": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^0.1.0",
              
            }
          }
        ,
          "react": {
            name: "react",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "frontend_shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.3.1",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "frontend_shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.3.1",
              
            }
          }
        ,
          "react-router-dom": {
            name: "react-router-dom",
            version: "6.30.2",
            scope: ["default"],
            loaded: false,
            from: "frontend_shell",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-router-dom"}' must be provided by host`);
              }
              usedShared["react-router-dom"].loaded = true
              const {"react-router-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^6.30.2",
              
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      