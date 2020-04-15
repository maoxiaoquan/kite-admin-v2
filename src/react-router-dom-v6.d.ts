// // with thanks
// https://dev.to/emreloper/react-router-v6-in-two-minutes-2i96
// https://github.com/ReactTraining/react-router/blob/dev/docs/installation/getting-started.md
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/9d29adedf662de685356f711951ef8b9e8342865/types/react-router/index.d.ts#L1
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/9d29adedf662de685356f711951ef8b9e8342865/types/react-router-dom/index.d.ts#L1

declare module "react-router-dom" {
  import * as React from 'react';

  /**
   * react-router-dom
   */

  // new in v6
  export function useNavigate(): (path: string) => void
  type NavigateProps<T> = {
    to: string,
    replace?: boolean,
    state?: T
  }
  export class Navigate<T = any> extends React.Component<NavigateProps<T>>{ }

  // from @vhenzl on github gist comment https://gist.github.com/sw-yx/37a6a3d248c2d4031801f0d568904df8
  export interface RedirectProps {
    from?: string;
    to: H.LocationDescriptor;
    children?: never;
  }
  export class Redirect extends React.Component<RedirectProps, any> { }

  // existing api's
  export interface BrowserRouterProps {
    basename?: string;
    getUserConfirmation?: (
      message: string,
      callback: (ok: boolean) => void
    ) => void;
    forceRefresh?: boolean;
    keyLength?: number;
  }
  export class BrowserRouter extends React.Component<BrowserRouterProps, any> { }

  export interface StaticContext {
    statusCode?: number;
  }


  export interface NavLinkProps<S = H.LocationState> extends LinkProps<S> {
    activeClassName?: string;
    activeStyle?: React.CSSProperties;
    exact?: boolean;
    strict?: boolean;
    isActive?<Params extends { [K in keyof Params]?: string }>(
      match: match<Params>,
      location: H.Location<S>
    ): boolean;
    location?: H.Location<S>;
  }
  export class NavLink<S = H.LocationState> extends React.Component<
    NavLinkProps<S>,
    any
    > { }
  export interface LinkProps<S = H.LocationState> extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    component?: React.ComponentType<any>;
    to: H.LocationDescriptor<S> | ((location: H.Location<S>) => H.LocationDescriptor<S>);
    replace?: boolean;
    innerRef?: React.Ref<HTMLAnchorElement>;
  }
  export class Link<S = H.LocationState> extends React.Component<
    LinkProps<S>,
    any
    > { }
  // new in v6
  export class Outlet extends React.Component {
    props: {}; // denying props or children!
  }
  /**
   * history
   */


  export namespace H {
    export type Action = 'PUSH' | 'POP' | 'REPLACE';
    export type UnregisterCallback = () => void;
    export interface History<HistoryLocationState = LocationState> {
      length: number;
      action: Action;
      location: Location<HistoryLocationState>;
      push(path: Path, state?: HistoryLocationState): void;
      push(location: LocationDescriptorObject<HistoryLocationState>): void;
      replace(path: Path, state?: HistoryLocationState): void;
      replace(location: LocationDescriptorObject<HistoryLocationState>): void;
      go(n: number): void;
      goBack(): void;
      goForward(): void;
      block(
        prompt?: boolean | string | TransitionPromptHook<HistoryLocationState>,
      ): UnregisterCallback;
      listen(listener: LocationListener<HistoryLocationState>): UnregisterCallback;
      createHref(location: LocationDescriptorObject<HistoryLocationState>): Href;
    }
    export type Location<S = LocationState> = {
      pathname: Pathname;
      search: Search;
      state: S;
      hash: Hash;
      key?: LocationKey;
    }

    export interface LocationDescriptorObject<S = LocationState> {
      pathname?: Pathname;
      search?: Search;
      state?: S;
      hash?: Hash;
      key?: LocationKey;
    }

    export namespace History {
      export type LocationDescriptor<S = LocationState> = Path | LocationDescriptorObject<S>;
      export type LocationKey = string;
      export type LocationListener<S = LocationState> = (
        location: Location<S>,
        action: Action,
      ) => void;
      // The value type here is a "poor man's `unknown`". When these types support TypeScript
      // 3.0+, we can replace this with `unknown`.
      type PoorMansUnknown = {} | null | undefined;
      export type LocationState = PoorMansUnknown;
      export type Path = string;
      export type Pathname = string;
      export type Search = string;
      export type TransitionHook<S = LocationState> = (
        location: Location<S>,
        callback: (result: any) => void,
      ) => any;
      export type TransitionPromptHook<S = LocationState> = (
        location: Location<S>,
        action: Action,
      ) => string | false | void;
      export type Hash = string;
      export type Href = string;
    }

    export type LocationDescriptor<S = LocationState> = History.LocationDescriptor<S>;
    export type LocationKey = History.LocationKey;
    export type LocationListener<S = LocationState> = History.LocationListener<S>;
    export type LocationState = History.LocationState;
    export type Path = History.Path;
    export type Pathname = History.Pathname;
    export type Search = History.Search;
    export type TransitionHook<S = LocationState> = History.TransitionHook<S>;
    export type TransitionPromptHook<
      S = LocationState
      > = History.TransitionPromptHook<S>;
    export type Hash = History.Hash;
    export type Href = History.Href;
  }

  /**
   * react-router
   */
  // new in v6
  export function useRoutes(routeArray: RouteProps[]): Routes

  // used to be SwitchProps
  export interface RoutesProps {
    children?: React.ReactNode;
    location?: H.Location;
  }
  // used to be Switch
  export class Routes extends React.Component<RoutesProps, any> { }
  export interface RouteComponentProps<
    Params extends { [K in keyof Params]?: string } = {},
    C extends StaticContext = StaticContext,
    S = H.LocationState
    > {
    history: H.History<S>;
    location: H.Location<S>;
    match: match<Params>;
    staticContext?: C;
  }

  export interface match<Params extends { [K in keyof Params]?: string } = {}> {
    params: Params;
    isExact: boolean;
    path: string;
    url: string;
  }

  export interface RouteProps {
    location?: H.Location;
    element?: React.ReactNode; // SWYX: shortcut; have to do see if we can do better
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    children?:
    // | ((props: RouteChildrenProps<any>) => React.ReactNode) // SWYX: i think this is not needed anymore?
    | RouteProps[] // new in v6
    | React.ReactNode;
    path?: string | string[];
    sensitive?: boolean;
    // // new in v6
    redirectTo?: string;
    // // no more in v6
    // component?:
    //   | React.ComponentType<RouteComponentProps<any>>
    //   | React.ComponentType<any>;
    // exact?: boolean; 
    // strict?: boolean;
  }
  export class Route<T extends RouteProps = RouteProps> extends React.Component<
    T,
    any
    > { }

}