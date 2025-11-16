declare module "mfe_customer/App" {
  export interface CustomerAppProps {
    basePath?: string;
    location?: import("react-router-dom").Location;
    navigate?: import("react-router-dom").NavigateFunction;
  }
  const Component: import("react").ComponentType<CustomerAppProps>;
  export default Component;
}

declare module "mfe_admin/App" {
  export interface AdminAppProps {
    basePath?: string;
    location?: import("react-router-dom").Location;
    navigate?: import("react-router-dom").NavigateFunction;
  }
  const Component: import("react").ComponentType<AdminAppProps>;
  export default Component;
}

