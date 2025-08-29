> ChatGPT generated setup tutorial

# Cross-Platform UI with React Native (Windows, macOS, and Web)

## Setting Up the React Native Toolchain (Windows & macOS)

## Install dependencies 

Windows: 
https://microsoft.github.io/react-native-windows/docs/rnw-dependencies

macOS: 
```sh
brew install cocoapods
brew install node
brew install watchman
```

## Initialize project

```sh
npx @react-native-community/cli init <projectName> --version 0.78
npx react-native-macos-init
npx react-native run-macos
# and in parallel: npm start

# install matching version
npm add react-native-windows@^0.78
# install new cpp-based template
npx react-native init-windows --template cpp-app --overwrite
npx @react-native-community/cli run-windows

```

https://microsoft.github.io/react-native-windows/docs/metro-config-out-tree-platforms

## Initializing react-native-web

`react-native-web`, mac and windows are usually not in sync regarding their dependencies. For macOS and windows we can fix that by updating them in sync. `react-native-web` is completely independent. 

I have followed https://dev.to/mikehamilton00/adding-web-support-to-a-react-native-project-in-2023-4m4l to setup subfolder `web` with its own build tools etc. We only need a setup that shares the UI sources, or parts of them. 


Follow https://blog.cvoice.io/how-to-setup-a-react-native-monorepo for setting up monorepo. 

# TODO:

For Web: The “web” target is handled via React Native for Web, which is a library that maps React Native components to web DOM elements. You don’t need a special SDK like Visual Studio or Xcode for web, but you do need a bundler (like Webpack or Metro) configured for web output. If you use Expo (discussed below), web support is built-in (you can run expo start --web). For a CLI project, you can add web support by installing react-native-web and a tool like Webpack or Next.js. For example, you can create a React Native project and then install react-native-web and configure Babel/Webpack to alias React Native to react-native-web ￼. Many developers use frameworks like Expo or Next.js to simplify this. In summary, for web you primarily need Node.js and a build tool; your React Native code (in TypeScript/JSX) will run in the browser using the React Native Web adapter.

Using TypeScript: New React Native projects can be initialized with a TypeScript template (as shown above), or you can convert a JavaScript project by adding a tsconfig.json and renaming files to .tsx. React Native’s CLI and Metro bundler have built-in support for TypeScript ￼. Ensure you have the TypeScript compiler installed (usually via the project’s devDependencies) and configure your IDE for TypeScript. Once set up, you can write your components and business logic in TypeScript, gaining static type checking.

Sample Cross-Platform “Hello World” App

To demonstrate a simple cross-platform UI, below is a trivial React Native app written in TypeScript. This same code can run on Windows, macOS, and web (as well as iOS/Android) with React Native:

import * as React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello from React Native!</Text>
      <Button 
        title={`Clicked ${count} times`} 
        onPress={() => {
          setCount(count + 1);
          Alert.alert('Button clicked', `You clicked ${count+1} times`);
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, marginBottom: 20 }
});

export default App;

This defines a functional component App using JSX. It displays a text label and a button. When the button is pressed, it updates a counter state and shows a native alert. Key points:
	•	We import core components like View, Text, and Button from 'react-native'. These are cross-platform components – on Windows, Text and Button will render as native UWP/WinUI text and a button; on macOS they render as NSText and NSButton (via Cocoa); on web, react-native-web maps them to HTML elements (e.g. a <div> containing a <span> and <button>).
	•	We use React state (useState) to update the button title dynamically – this shows that React’s paradigms (state, props, hooks) work the same in React Native.
	•	The Alert.alert API invokes a native dialog on each platform (an alert box on web, a MessageBox on Windows, an NSAlert on macOS, etc.), demonstrating how React Native provides native-feeling UI/UX.

When you run this app on each platform, the UI and functionality are the same: a centered text and a button that updates its label and triggers an alert. The styling uses Flexbox (justifyContent: 'center', alignItems: 'center') which works consistently across platforms to center the content ￼. The React Native packager ensures the TypeScript/JS code is bundled appropriately for each target: for web it produces a bundle that runs in the browser, for Windows a bundle consumed by the app’s embedded JS engine, etc.

Screenshot: Below is how the app appears on each platform (with slight native styling differences):
	•	Windows: A native window with a WinUI button and text.
	•	macOS: A Mac app window with Cocoa text and a rounded push button.
	•	Web: A webpage with an HTML button and text (centered in the browser window).

(Imagine an image here illustrating the app on each platform.)

React Fundamentals Quick Tutorial

If you’re new to React, it’s important to grasp the core concepts of components, JSX, props, and state before diving into React Native:
	•	Components: React applications are built from components – reusable pieces of UI. In React Native, components can be defined as JavaScript functions or classes. For example, App in the code above is a functional component. Components use JSX (JavaScript XML) syntax to describe UI structure. JSX looks like HTML/XML, but it represents native UI elements in React Native. For instance, <View> in React Native is analogous to a <div> on the web, and <Text> is like a <span> or <p> ￼. You return JSX from your component to tell React what to render.
	•	JSX: JSX allows you to write markup-like syntax directly in your JavaScript/TypeScript. Under the hood, this is transformed into calls to React’s APIs. In React (web), JSX tags correspond to DOM elements; in React Native, they correspond to native widgets. For example, <Button onPress={...}>Click</Button> in React Native will render as a native button control on each platform. JSX supports dynamic insertion of values and expressions using curly braces {}. It may look like HTML, but it isn’t – for example, in JSX we use className instead of class, onPress instead of onclick, etc., because it’s JavaScript, not HTML ￼ ￼.
	•	Props: These are parameters passed into components, similar to function arguments. Props make components configurable and reusable. For example, the Button component has props like title and onPress. Your own components can define custom props. In a class component you’d access them via this.props, and in functional components you receive them as the function argument. Props are read-only – a component should not modify its props, but rather respond to them. If you have a child component, you pass data down to it via props.
	•	State: While props are external inputs, state represents internal data that a component manages itself. State is mutable (through setState/useState) and changing state causes the component to re-render. In our sample, count is state. We call setCount to update it, which triggers React to re-render the App component with the new count (updating the button label). State is used for interactive, dynamic UIs. In React Native, state works the same as in React for web – under the hood, React schedules updates and diffs the virtual DOM (or rather, a virtual tree of native components) to apply changes.
	•	One-way Data Flow: React (and React Native) enforce one-way data flow: parent components pass props down to children; children can call functions (passed via props) to notify the parent of events. This is important when mixing native code – you’ll often pass callbacks or use events to communicate between the React layer and native C++ layer (more on that later) ￼.

Overall, building a UI in React Native is very similar to React web development – if you know how to build a React app, you mostly need to learn the React Native-specific components and APIs (and of course, how to set up the native projects). A great way to get started is the official React Native tutorial ￼, which walks through creating a simple “Hello World” and introducing these concepts with examples. The key point is that you describe what the UI should look like given some state, and React/React Native will handle updating the real UI elements when that state changes.

How React Native Works Under the Hood

React Native Architecture: In a React Native app, your React/TypeScript code does not run in a web browser (except when targeting the web). Instead, it runs in a JavaScript engine (such as Hermes or JavaScriptCore) embedded in the app. On mobile devices, React Native historically used JavaScriptCore (the engine behind Safari). In modern React Native (0.70+), Hermes is often the default engine on Android and iOS, and it is supported on Windows and macOS as well ￼. Hermes is a lightweight JS engine optimized for React Native – one of its features is that it can precompile JavaScript into efficient bytecode ahead of time. In fact, when you do a production build, the React Native build tools can compile your JS bundle into a Hermes bytecode file (usually with .hbc extension) at build time, which improves startup performance ￼. This means much of the work is done at compile time, aligning with your desire to do as much as possible ahead-of-time. The bytecode is then packaged with the app, and the Hermes VM executes it directly (avoiding parsing JavaScript source on the device).

At runtime, the app consists of two sides: the JavaScript side (running your code in the JS engine) and the native side (the host OS UI and modules). These two sides communicate via the React Native Bridge (in the classic architecture) or via the new JSI (JavaScript Interface) in the new architecture. In either case, the idea is that UI events, commands, and data need to flow between the JavaScript logic and the native UI elements:
	•	Your components (JS code) render to native widgets. For example, <Text> in JSX becomes a UITextView on iOS, an NSTextField on macOS, a TextBlock on Windows, or a <span> on web. The mapping is handled by the React Native runtime and platform-specific “renderer”. On iOS/macOS this renderer is written in Objective-C/C++; on Windows, in C++ with WinRT. React (the library) uses a shadow tree to compute layout and diff UI changes, and issues commands to the native platform to create/update UI elements.
	•	When a user interacts (e.g., clicks a button), the native code detects this (e.g., a UIButton sends a touch-up event to the RN runtime), which then invokes the corresponding JavaScript handler (your onPress function). In the old architecture this went over an asynchronous Bridge (serialized as messages); in the new Fabric architecture, UI events can call directly into JS through JSI for lower latency.

Native Components and Modules: React Native includes a core set of components (View, Text, Image, ScrollView, etc.) which are implemented for each platform. It also includes native modules for common functionality (e.g., dialogs, networking, sensors). If something is not available, you can extend React Native with your own native module or UI component. The React Native runtime on each platform is designed to allow integration of custom native code. In fact, Microsoft’s implementation of React Native for Windows and macOS is an extension of the core – it uses the same JavaScript engine and framework, but implements the “renderer” and modules for WinUI (Windows) and AppKit (macOS) ￼ ￼. On Windows, React Native relies on the Windows App SDK (WinAppSDK) and WinUI 3 for its UI under the covers ￼ ￼. This means React Native for Windows apps use native WinUI controls (fluent design) for things like buttons, text, etc., giving users a truly native look and feel ￼ ￼. The React Native Windows runtime itself is built in C++ and ties into the WinAppSDK. (Note: WinAppSDK requires Windows 10 1809+ or Windows 11, so React Native Windows apps only run on modern Windows versions ￼.)

On macOS, React Native for macOS is similarly implemented to use AppKit controls. Microsoft maintains React Native macOS aligned with the core React Native version (it was at v0.79 as of mid-2025, similar to Windows) ￼. Under the hood, it shares a lot with iOS – for example, an RCTView on iOS is a UIView, on macOS it’s an NSView.

For web, React Native for Web is actually a compatibility layer: it takes the React Native components and implements them using web technologies (HTML, CSS, DOM events). There is no separate runtime – it’s just normal React DOM in the browser. Thus, targeting web is more akin to building a React web app that reuses your React Native components, rather than embedding a JS engine in an app.

Runtime Dependencies: When deploying your app, the following get bundled/incorporated:
	•	The JavaScript bundle (or bytecode) containing your app’s logic. This can be a single file produced by Metro (e.g., index.bundlejs or index.android.bundle, etc., or a bytecode file for Hermes). In release mode, this is often embedded as a resource in the app binary, so that the app can load it from disk without needing a development server.
	•	The JavaScript engine: e.g., Hermes or ChakraCore. On Android and iOS, Hermes can be statically linked into the binary. On Windows, Hermes is supported too (React Native for Windows 0.70+ allows using Hermes instead of ChakraCore) ￼ ￼. By linking the JS engine and including the precompiled bytecode, you have a largely self-contained executable. There might still be some dynamic libraries – e.g., on Windows, the WinAppSDK and C++ runtime, etc., or on macOS the AppKit framework – but those are standard platform dependencies. You can configure static linking for some libraries if needed (for example, if you want one single EXE on Windows, you might use static runtime linking, but WinUI will still require some DLLs).
	•	The React Native core libraries for each platform: This includes the C++ code that implements the bridge or JSI, the platform-specific components, and native modules. On Windows, ReactNative.Windows is provided as a NuGet package containing the necessary binaries (which get included in your app package) ￼. On macOS and iOS, React Native is provided as CocoaPods (pods like React-Core, React-RCTText, etc.) which get compiled into your app. These can be statically linked into your app’s binary. So, effectively, yes – you will link in the React Native framework and JS engine, such that your C++ application has everything it needs at runtime.

In summary, React Native’s approach is to do as much as possible at build time (bundle the JS, optionally precompile it to bytecode, compile all native code) so that at runtime, there’s no dependency on a separate interpreter or package manager. The resulting app is a native executable that contains an embedded JS runtime executing your UI logic and interfacing with native UI components. This is different from web apps or Electron – you are not loading code from the internet (except in dev mode) and not running in a browser; it’s a compiled app that can even run offline without any “browser” dependency (on Windows, for instance, RN apps use the system’s Edge WebView2 only if you use a <WebView> component to display web content, but not for the general UI).

Frameworks on Top of React Native (Expo and Others)

The official React Native documentation now recommends using a higher-level framework on top of core React Native for new projects ￼. The idea is that React Native by itself is a lower-level toolkit, and frameworks can simplify the setup and add convenient features. The most prominent framework is Expo. Expo provides an SDK and tooling on top of React Native that handles a lot of configuration and provides cross-platform modules (for things like camera, push notifications, updates) without requiring you to write native code.

Expo: Expo can be thought of as a layer that abstracts the native details. Using Expo, you can start a project with Expo CLI which sets up a React Native app in a managed workflow. Expo includes its own build/packaging service, and you can use the Expo Go app for development without even compiling native code (great for quick iteration). Importantly, Expo supports web out of the box in addition to iOS and Android. (Expo’s web support uses React Native Web behind the scenes – so the same code can run on the web by simply running expo start --web.) As of mid-2025, Expo’s support for Windows and macOS is experimental – the focus is still mobile and web, but there are community efforts and future plans to support desktop via Expo plugins. The React Native team at Meta specifically “recommends using Expo as the framework of choice for new projects” ￼ because it provides a lot of out-of-the-box functionality and “solves common infrastructure problems… enabling production-ready apps without re-inventing the wheel” ￼ ￼.

Using Expo, you get benefits like:
	•	Simpler development setup: no need to directly configure Xcode or Android Studio for a basic project. Expo handles the native builds (using a service called EAS) and you can focus on JavaScript/TypeScript.
	•	Cross-platform modules: Expo SDK includes modules for sensors, device info, image picker, etc., that work uniformly across platforms. It saves you from installing and linking separate libraries or writing native code.
	•	OTA updates: Expo can push over-the-air JS bundle updates to your app, so you can deploy small updates without going through app store releases (within the limits of policy).
	•	Web support: as mentioned, if you write an Expo app, you can also run it as a web app. Expo will ensure compatibility (though not every native module works on web).
	•	Community and tooling: things like Expo’s dev client, snack experiments, etc., improve developer experience.

However, Expo’s managed workflow has some limitations. If your app requires custom native code or an unsupported library, you might need to “eject” from Expo (Expo provides a preconfigured bare workflow which basically converts it to a normal React Native project that you can open in Xcode/Android Studio). In an ejected or bare Expo project, you can then integrate Windows and macOS support by adding the react-native-windows/react-native-macos packages as described earlier.

Other Frameworks: Expo is the major one, but not the only option:
	•	Microsoft’s React Native platforms (React Native Windows and macOS) can be seen as extensions to React Native itself. They are not separate frameworks, but you might treat them as a platform-specific framework. Microsoft provides documentation and tooling (like the RNW CLI) to ease creating apps on those platforms.
	•	Framework vs Core: It’s worth noting that core React Native (sometimes called “React Native CLI” workflow) can do everything, but you have to piece together things like navigation, theming, updates, etc. A framework like Expo (or others) gives you a more integrated solution. For example, Expo includes its own navigation library and theming support, though you can also use React Navigation or other libraries in a bare RN app.
	•	React Native DOM / Electrode (historical): In the past, there have been projects like ReactXP (by Microsoft) and Electrode Native (by Walmart) aimed at unifying development. ReactXP was a thin abstraction layer over React Native and React DOM to write truly cross-platform (including web) code; it had some adoption but today most people use react-native-web directly or frameworks like Next.js for web. Electrode Native is more of a platform to integrate RN into existing apps, not widely used anymore compared to RN’s own official support.
	•	One (React Native One): There are new experimental frameworks (like a project called “One”) that aim to unify web and native by providing a single React-based framework. But these are cutting-edge and not widely adopted yet.
	•	Next.js with React Native Web: While Next.js is a React web framework, some developers treat a combo of “React Native for mobile + Next.js for web” as their cross-platform approach, sharing a lot of code. Tools like Expo Router (which builds on React Navigation) can allow using file-based routing similar to Next.js across mobile and web.

In summary, Expo is the recommended starting point for many new apps ￼. It provides a great developer experience and covers web and mobile out-of-the-box. If your target is specifically Windows/macOS and web (desktop platforms), you might use Expo for web and a standard RN project for desktop, or use the bare workflow for all. The advantage of frameworks like Expo is they handle configuration and include common features, letting you focus on writing your app. The disadvantage can be less flexibility for custom native code, but you can always eject when needed.

The React Native team’s philosophy here is that React Native is a platform, and frameworks like Expo sit on top to streamline app development ￼. In practice, if you want to maximize code-sharing across Windows, macOS, and Web, you will likely use a combination of:
	•	React Native CLI + react-native-windows + react-native-macos for the Windows and Mac versions (giving you native desktop apps in C++).
	•	React Native for Web (possibly via Expo or Next.js) for the web version.
	•	Shared UI code (components) and logic in TypeScript that run in all these targets, with perhaps some platform-specific forks where necessary (using Platform.OS or conditional imports when a UI needs to differ).

Integrating C++ with React Native (Native Modules and Event Handling)

One of React Native’s strengths is the ability to bridge between JavaScript and native code (C++, Objective-C, Java, etc.). In your scenario, the core application is in C++, and you want to both handle events in C++ and manipulate React Native UI from C++. This is achievable through native modules, native UI components, and the communication mechanisms RN provides.

Using Native Modules (C++): A native module is basically a C++ (or C# on Windows, or Objective-C on Mac) class that is exposed to JavaScript. You can think of it as creating a JavaScript API that is implemented in C++. For example, you might have a C++ module DataManager with a method getLatestData() or performCalculation(x,y) that you want to call from JS. You can write this module and register it with React Native. The JavaScript code can then call it via NativeModules.DataManager.performCalculation(5,3) which will execute your C++ code and return the result (possibly via a Promise).

React Native for Windows supports writing native modules in C++/WinRT or C++/CX, and React Native for macOS (and iOS) supports writing them in Objective-C++ or Swift. Since your app logic is C++, you’ll likely create a C++ library that the RN native module calls into. Microsoft’s documentation notes that you can author native modules in C++ on Windows, and even provides a codegen tool to make it easier ￼. The process roughly is:
	1.	Define a C++ class for your module, e.g. MyModule, and use the provided macros/attributes to mark methods that should be exposed to JS. For instance, on Windows with C++/WinRT, you might use REACT_METHOD attribute to expose a method.
	2.	Register the module in the React Native host so that the JS runtime knows about it. In Windows, this could be done by adding it to the package provider; on Mac/iOS, you’d typically implement an RCTBridgeModule in Objective-C that wraps your C++ (using an Objective-C++ .mm file).
	3.	From JavaScript, use NativeModules.MyModule to access the exposed methods. These methods can return values (including Promises for async work, which is common since native calls are often asynchronous).

For example, suppose you want to handle a button press in C++ instead of JS. One approach is: in your JS, instead of having an onPress that updates state directly, you call a native module:

<Button title="Do Native Action" onPress={() => NativeModules.MyModule.onButtonPressed()} />

If onButtonPressed is a method you exposed in C++, then when the user clicks the button, it triggers your C++ code via the bridge. Your C++ code can then perform whatever action (compute something, write to a database, etc.). If it needs to send a result back to JS (for example, to update the UI), it can either return a value (if synchronous and small) or more commonly, invoke a callback/promise resolution. In the classic bridge, you might call a JavaScript callback that was passed in. In the new architecture, you might use a JSI-hosted function or emit an event.

Sending data/events to JavaScript: If your C++ code needs to notify the JS/react side (say, an asynchronous operation completed, or an external event happened), you can use the event emitter system. On iOS/macOS, you’d use RCTDeviceEventEmitter to emit an event; on Windows, you can use the ReactEventEmitter in C++/WinRT to do similarly (or use a callback as part of your module API). The JS side can subscribe to these events via the EventEmitter API (NativeEventEmitter). For instance, a C++ module could emit an event "DataUpdated" with some payload, and in your JS you would add a listener to update React state when that event fires.

Accessing C++ from JS via JSI: With the new JSI (JavaScript Interface), it’s possible to register C++ functions/objects directly into the JavaScript runtime. This is an advanced technique but can yield faster communication (no JSON serialization). You essentially embed your C++ logic as JS-callable functions (as if they were built-in). For example, you could use JSI to make a global.callNativeFoo() that directly invokes C++ code. This is how the new TurboModules and Fabric components work under the hood. It may be overkill if you’re just starting, but keep in mind that this exists if you need high-performance interaction.

Why use native modules? Some tasks are better done (or can only be done) in native code – accessing OS-specific APIs, heavy computations, existing C++ libraries, etc. As the RN docs say, “If React Native doesn’t support a native feature that you need, you should be able to build it yourself.” ￼ This is exactly what native modules are for. You can leverage your existing C++ codebase by wrapping it in a React Native module. For instance, if you have a C++ library that processes images or handles networking with custom logic, you can write thin modules on each platform to invoke that library and then call those from JS.

Example: Suppose your C++ code has a function double CalculatePi(int iterations). You want to call this from the React Native UI (maybe when a button is pressed, to show the result). You could create a native module:
	•	Windows: C++/WinRT class CalculatorModule with a method CalculatePi(int32_t iterations) -> double. Mark it with REACT_METHOD. Implement it to call your internal C++ function and return the result. Register CalculatorModule in the package provider.
	•	macOS: Objective-C++ CalculatorModule.mm that implements an RCTBridgeModule. Use RCT_EXPORT_METHOD to expose a method calculatePi:(NSInteger)iterations resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject. In the implementation, call your C++ function and then call resolve(result).
	•	Then, in JS: const { CalculatorModule } = NativeModules; ... onPress={() => CalculatorModule.calculatePi(1000000).then(result => setPi(result)) }.

This way, the heavy lifting is done in C++, and the UI stays responsive (you might actually call such a function in a background thread in C++ and resolve the promise later to avoid blocking the JS event loop).

Passing data to React Native controls: You might also want to initialize your React Native components with data from C++. For example, your C++ core might have some model data (say a list of items) that you want to display in a React Native <FlatList>. There are a couple of ways to do this:
	•	Initial Props: When you first load the React Native component (via RCTRootView or when registering the app), you can pass initial properties from native to JS. For instance, on iOS/macOS, RCTRootView has an initialProperties parameter ￼. You could serialize your data (e.g., as JSON) and pass it in here. The root React component will receive it via this.props. The RN documentation shows an example of passing an array of images from native to a React component via initialProperties ￼ ￼. You can do the same on Windows using ReactRootView or when initializing the instance.
	•	Dynamic updates: After the app is running, the native side can push new props to the RN component using the setAppProperties (on iOS) or similar mechanisms ￼. However, a more common approach is to use an event or callback. For instance, your C++ can emit an event “DataReady” with payload, and in your React component you listen for that event and update component state when it arrives.
	•	Direct method calls: In the new architecture with JSI, if you have a JSI module, JS could directly call e.g. GlobalData.getItems() which returns a JS array constructed from C++ data. Without JSI, you’d do it via a native module method that returns the data (possibly as a JSON string or as a structure that RN can convert).

Implementing event handlers in C++: If by “event handlers” you mean handling UI events (like button clicks, text input changes) in C++ rather than in JS, you can achieve this by creating custom native UI components. For example, you could create a custom NativeButton component: when used in JS, it looks like a normal button but internally it doesn’t send the press event to JS – instead, it directly calls some C++ callback. This is a more advanced integration (“brownfield” approach). A simpler pattern is the one described earlier: handle the event in JS but immediately delegate to C++ (through a native module). That still involves a JS function call, but minimal logic in JS.

It’s worth noting that Office (Word, Excel, etc.) uses React Native for parts of its UI on Windows, and they embed React Native components into a larger C++ app. They have mentioned that React Native “content islands” can send events and data back and forth, enabling Office’s C++ code and the RN components to stay in sync ￼ ￼. So the pattern is proven in large-scale software.

Embedding React Native Views in Existing Native Applications

You indicated that you have existing C++ application windows (Win32 on Windows, Cocoa on macOS) and you want to embed React Native-based UIs within them. This is often called a “brownfield” integration (mixing RN into an existing native app). It is definitely possible: React Native supports rendering to an arbitrary window or view that you host.

On Windows (Win32): Because React Native for Windows uses UWP/WinUI under the hood, one way to embed it in a traditional Win32 app is via XAML Islands. XAML Islands allow UWP UI elements to be hosted in a Win32 window (e.g., inside an HWND). Microsoft explicitly mentions that “You can integrate React Native components inside WPF or Windows Forms applications, by leveraging XAML Islands, which allows UWP controls to render inside Win32 applications.” ￼. In your case, instead of WPF/WinForms, you have a C++ Win32 app, but the concept is similar: you create a XAML Island in your Win32 window and within that island, initialize a React Native root view.

Concretely, Microsoft has a feature called Content Islands for React Native. This means you can create a ReactRootView (or ReactView) and embed it. The Office team used this to modernize parts of Office’s UI. As reported, “React Native components can be embedded into existing Windows applications… React Native content islands seamlessly integrate into an app’s UI” ￼ ￼. In practice, the steps on Windows might be:
	•	Initialize the React Native runtime in your process. If you use the React Native Windows NuGet, you might create a ReactInstanceSettings and ReactNativeHost in your C++ app.
	•	Create a XAML container (if using XAML Islands, you might have an DesktopWindowXamlSource to host XAML content in your HWND).
	•	Within that XAML content, create a ReactRootView and point it at your React component (moduleName). For example, in a WPF app, one would use <ReactControl x:Name="MyReactControl" ComponentName="MyApp" /> in XAML. In pure Win32, you likely instantiate the React control via code.
	•	The ReactRootView will load the JavaScript bundle (you provide the path to the bundle or Metro server) and mount the RN component tree into that view.

From that point, it behaves like any other part of the UI: the RN components appear as part of your window. You can size the ReactRootView to fit wherever you want in your layout. You can also have multiple RN islands if needed.

If your Win32 app uses a message loop and not XAML, you can still use XAML Islands by initializing a XAML framework within your window. Microsoft’s docs and samples for RNW show how to host in a WinForms/WPF app, which can be analogous to a raw Win32 app. (A simpler but heavier alternative is to have a separate UWP app that is packaged with your Win32 app and communicate between them – but that’s likely unnecessary given XAML Islands.)

On macOS (Cocoa): On Mac, React Native for macOS is built on Cocoa (AppKit). To embed a React Native component in a Cocoa app, you will use an RCTRootView. Just as on iOS you can integrate RN by adding an RCTRootView to a UIViewController’s view, on macOS you add RCTRootView to your NSWindow/NSView. For example, you might have a native NSWindow (perhaps your C++ app uses Objective-C++ to create Mac UI or uses Qt or something; but assuming you can get an NSView to attach to). You’d do something like:

#import <React/RCTBridge.h>
#import <React/RCTRootView.h>

// ... initialize an RCTBridge with the JS bundle ...
NSURL *jsBundle = [NSURL fileURLWithPath:@"main.bundle"];
RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsBundle
                                          moduleProvider:nil
                                           launchOptions:nil];

// Create the root view for the React component "MyApp"
RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge 
                                                 moduleName:@"MyApp" 
                                          initialProperties:nil];

// Add rootView as a subview of your window’s contentView
[window.contentView addSubview:rootView];
rootView.frame = window.contentView.bounds;

This is analogous to the iOS integration described in React Native’s docs: “Integrate React Native with your iOS (or macOS) app by adding an RCTRootView. This is a UIView (or NSView on macOS) that holds the React Native app.” ￼ ￼. The RCTRootView is the bridge between native and React: it will create the React component hierarchy and handle updating native views. You can pass initialProperties if you want to supply initial data from your C++ app to the RN component ￼. The moduleName corresponds to what you registered in JavaScript via AppRegistry.registerComponent. Once this root view is added, the React Native JS will execute and the view will render its content.

One thing to manage is the lifecycle: you should keep the RCTBridge around (maybe as a singleton or tied to your window controller) so that the JS runtime stays alive. Also, to clean up, you’d release those objects when the window closes.

Both on Windows and Mac, embedding means you can incrementally adopt React Native in parts of your application. For example, you might have a settings dialog in your app which you decide to implement in React Native for consistency across platforms. You embed an RN root view inside your native dialog. The rest of your app remains native C++, but this one area is powered by RN. This approach is frequently called the “Island” approach (as Microsoft calls content islands) or “brownfield” approach. It lets you modernize UI without rewriting everything at once ￼ ￼.

Communication in embedded scenario: When RN is inside an existing app, you often need two-way communication:
	•	Native (C++) must be able to tell React Native things (e.g., “user logged in” or “item list updated”). This can be done via the props or events method described above (set properties on the RCTRootView or send events through the bridge).
	•	React Native UI must be able to trigger native functionalities (e.g., “open a file”, “perform some calculation”), which you handle in C++. This is done via native modules or callbacks as described. For instance, if the RN UI has a “Save” button, its onPress could call a native module method NativeModules.AppHost.saveDocument(), which your C++ implements.

The React Native documentation has a “Communication between native and React Native” guide ￼ that summarizes techniques like props, callbacks, and the NativeModule-based event emitters. A key limitation mentioned is that you cannot directly pass a C++ function as a prop (since props must be serializable), so instead you use the provided cross-language call mechanisms ￼ – either send a “command” from JS to native via a module, or send an “event” from native to JS.

In practice, when done right, the user won’t know that part of the UI is React Native – it will appear seamless. For example, your app’s menu and title bar might be native, but a portion of the window is a React Native-powered view. Microsoft even allows mixing WinUI and RN content in the same window; you could have a WinUI 3 control next to an RN control, and data flows between them ￼ ￼.

Custom Native UI Components (Rendering with Metal/OpenGL/DirectX)

Lastly, you asked about integrating custom-rendered widgets – specifically, widgets that your application renders itself using Metal, OpenGL, or DirectX – into React Native. You want a simple example of rendering a triangle with OpenGL on macOS and Web, and DirectX on Windows, as a custom widget within a React Native app.

This involves creating a Native UI Component for React Native on each platform:
	•	On macOS, a custom NSView that uses OpenGL (or Metal) to draw.
	•	On Windows, a custom XAML control or swapchain panel that uses DirectX to draw.
	•	On Web, a custom React component that uses an HTML <canvas> with WebGL.

React Native allows you to register custom native UI components so that they can be used in JSX just like built-in components. You’ll typically write a native module that includes a View Manager. The View Manager exposes a new component to JS, and handles creating the native view and properties/events for it. For example, you might register a component named "GLView" which in JS you use as <GLView style={{width: 300, height: 300}} />. The native side will create an instance of your GL rendering view.

macOS OpenGL Example: We can subclass NSOpenGLView (which is an AppKit view that wraps an OpenGL context). Note: OpenGL on macOS is deprecated since 10.14 in favor of Metal, but it still works and is simpler for an example. Our custom NSView will override drawRect: to issue OpenGL draw calls. For instance, an extremely simple OpenGL render for a triangle:

@implementation MyOpenGLView : NSOpenGLView
- (void)drawRect:(NSRect)dirtyRect {
  [super drawRect:dirtyRect];
  glClearColor(0, 0, 0, 1);              // Black background
  glClear(GL_COLOR_BUFFER_BIT);
  glColor3f(0.5f, 0.8f, 0.1f);           // Set draw color (e.g., green)
  glBegin(GL_TRIANGLES); {
    glVertex3f(-0.5f, -0.5f, 0.0f);      // Vertex 1 (x=-0.5, y=-0.5)
    glVertex3f( 0.0f,  0.5f, 0.0f);      // Vertex 2 (x=0.0, y=0.5)
    glVertex3f( 0.5f, -0.5f, 0.0f);      // Vertex 3 (x=0.5, y=-0.5)
  } glEnd();
  glFlush();  // Flush the OpenGL commands to ensure drawing
}
@end

This code clears the view and draws a single triangle covering a portion of the view ￼. To integrate this with React Native, you would create an RCTViewManager subclass in Objective-C that creates a MyOpenGLView when the JS side requests it. Something like:

@interface RCTOpenGLViewManager : RCTViewManager
@end

@implementation RCTOpenGLViewManager
RCT_EXPORT_MODULE(OpenGLView)  // JS name of the component
- (NSView *)view {
  return [[MyOpenGLView alloc] init];
}
@end

Now, in JavaScript, after importing/registering this native module, you could use <OpenGLView style={{ width: 300, height: 300 }} /> in your JSX, and it would render as an OpenGL triangle on macOS. (In iOS, you’d do similar using GLKView or CAEAGLLayer since NSOpenGLView is macOS-specific; on iOS Metal is preferred nowadays.)

Windows DirectX Example: On Windows, you might create a XAML UserControl that contains a SwapChainPanel or uses DirectComposition with a swap chain to render DirectX content. The React Native for Windows view manager would create this control. For simplicity, consider using DirectX 11 to draw a triangle. The core steps in D3D11 are:
	•	Create a D3D device and swap chain targeting the panel’s swapchain.
	•	Create vertex buffer with triangle vertices.
	•	Create shaders (vertex and pixel shader) to render the triangle.
	•	In the panel’s rendering callback (like on CompositionTarget::Rendering event or using DXGI’s vertical blank event), set the render target, clear it, set the vertex buffer and shaders, and call Draw(3,0).

Pseudo-code snippet for the rendering part in C++ could be:

// Define triangle vertices (position and color)
struct Vertex { DirectX::XMFLOAT3 pos; DirectX::XMFLOAT4 color; };
Vertex vertices[] = {
  { {  0.0f,  0.5f, 0.5f }, {0.0f, 1.0f, 0.0f, 1.0f} },  // top, green
  { {  0.5f, -0.5f, 0.5f }, {0.0f, 1.0f, 0.0f, 1.0f} },  // right, green
  { { -0.5f, -0.5f, 0.5f }, {0.0f, 1.0f, 0.0f, 1.0f} }   // left, green
};

// Create D3D11 buffer for vertices (code omitted for brevity)...

// In render loop:
context->ClearRenderTargetView(renderTargetView, DirectX::Colors::Black);
UINT stride = sizeof(Vertex), offset = 0;
context->IASetVertexBuffers(0, 1, &vertexBuffer, &stride, &offset);
context->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
context->Draw(3, 0);  // draw 3 vertices (one triangle) [oai_citation:61‡stackoverflow.com](https://stackoverflow.com/questions/26451705/direct3d-11-drawing-a-triangle#:~:text=p_D3D11DeviceContext) [oai_citation:62‡stackoverflow.com](https://stackoverflow.com/questions/26451705/direct3d-11-drawing-a-triangle#:~:text=,0f%29)
swapChain->Present(1, 0);

This would draw a single triangle in the middle of the swap chain panel (with coordinates in clip space). The above draws a green triangle by issuing a Draw call with 3 vertices ￼ ￼. The full setup requires initializing DirectX (device, context, swap chain, shaders), which is beyond our scope here, but numerous D3D11 “Hello Triangle” tutorials show the setup ￼. The key point is that you can host a D3D-powered control in React Native. In fact, Microsoft’s Babylon React Native project does exactly this: it integrates a 3D engine (Babylon.js) with React Native by providing a native view that sets up a graphics context (using DirectX on Windows, Metal on iOS, OpenGL/Metal on Mac, etc.) and then runs rendering on it ￼. Babylon React Native uses C++ and JSI to connect Babylon’s rendering loop to the React Native app.

To integrate our custom DirectX view, you would write a C++/CX or C++/WinRT ReactWidgetViewManager that extends React::ViewManager<ReactWidgetViewManager> (or similar) and creates the UserControl with the swapchain. You’d export that with a module name, e.g. “DXView”. Then in JS you use <DXView style={{ width: 300, height: 300 }} />. When that component mounts, your native code kicks in and starts the DirectX rendering in that area.

Web (WebGL) Example: On the web, since React Native for Web runs in a browser, you can simply use a <canvas> element. There isn’t a built-in React Native Core component for canvas, but you can either use a third-party like react-three-fiber or implement a tiny one yourself. The easiest approach: create a normal React web component that wraps a canvas and uses the WebGL API. For example:

import React, { useRef, useEffect } from 'react';

function GLCanvas(props) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    // Define vertices for a triangle (2D coordinates)
    const vertices = new Float32Array([
      -0.5, -0.5,
       0.0,  0.5,
       0.5, -0.5
    ]);
    // Create a buffer and put triangle data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // (Setup vertex shader, fragment shader, and attributes - omitted for brevity)
    // ... assume we set up a simple shader that takes the vertex directly
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);  // Draw the 3 vertices as a triangle [oai_citation:67‡tutorialspoint.com](https://www.tutorialspoint.com/webgl/webgl_drawing_a_model.htm#:~:text=var%20vertices%20%3D%20%5B,0.5%2C%5D%3B%20gl.drawArrays%28gl.TRIANGLES%2C%200%2C%203)
  }, []);
  return <canvas ref={canvasRef} width={300} height={300} style={props.style} />;
}

This React component (usable only on web) will, on mount, draw a triangle on a 300x300 canvas using WebGL. The code above creates a WebGL context, sets up a vertex buffer with 3 points (two coordinates per vertex) and calls gl.drawArrays(gl.TRIANGLES, 0, 3) to render ￼. In a real implementation you need shaders to actually position and color the triangle – WebGL requires writing a small vertex and fragment shader. To keep it simple, imagine we have those shaders set to draw a solid colored triangle.

To integrate this with a cross-platform app, you can use conditional rendering: on web, render <GLCanvas>, and on native (Windows/macOS), render <OpenGLView> or <DXView> respectively. You could hide this behind a single abstraction in JS that picks the right one for the platform (using Platform.OS).

In summary, custom drawing in React Native is achieved by writing platform-specific components. React Native’s architecture is flexible enough that you can embed any native view. For instance, you mentioned Metal – on iOS/macOS you could use MTKView (Metal Kit) in a similar way to draw with Metal. The process is analogous to the OpenGL example but using Metal’s APIs. On Windows, you could even use DirectX 12 or any rendering tech, as long as you can get it to render into a SwapChainPanel or custom window. The key steps:
	1.	Native view implementation: (NSView, UserControl, UIView, etc.) that does the rendering.
	2.	View Manager exposure: to let React Native create that view from JS. This typically involves a bit of boilerplate to register the module and handle props/events.
	3.	Usage in JS: Use the new component like any other, possibly handling its events or passing props (e.g., you might allow a prop for the triangle’s color, which your view manager maps to setting the clear color or vertex color).

For a triangle, we kept it simple with static geometry. In a real scenario, you might want the C++ side to pass vertices or draw something dynamic. You could then expose properties or methods to update the native view. For example, you could expose a method updateVertices(newVertices) on the native component via a command, or use a prop that when changed triggers the native view to redraw with new data (RN’s UI manager can propagate prop changes).

Handling input in custom views: If your custom widget needs mouse/keyboard input (you mentioned some of your widgets handle their own input), you can have the native view handle those natively. For instance, your NSOpenGLView can override mouseDown: etc., and your Windows control can handle pointer pressed events. You could then either keep that logic entirely in C++ (if it doesn’t need to inform JS), or you could notify the JS app of something (perhaps via an event). React Native doesn’t mind if a native component handles input – it will only fire JS gesture events if you explicitly send them. So you have full control in your custom view. This is a powerful way to integrate something like a game engine or a complex 3D view into a React Native app: the custom view manages all its rendering and input, and you use React Native for the surrounding UI (menus, buttons overlay, etc.). Babylon React Native is an example where the 3D view (with touch controls for camera) is a native component, and the UI around it (buttons to switch scenes, etc.) is React Native.

To sum up, creating a cross-platform custom-rendered widget involved writing some platform-specific code, but React Native’s modular architecture makes it feasible. We demonstrated how to draw a basic triangle using OpenGL on macOS (and similarly on the web via WebGL) and DirectX on Windows. With this approach, you can integrate your own rendering engine (be it OpenGL, DirectX, Metal, or Vulkan) into React Native, allowing you to reuse your C++ rendering logic. This addresses your requirement (5) by essentially embedding your custom widget inside a React Native component – on each platform it invokes the appropriate graphics API (OpenGL/WebGL for Mac/Web, DirectX for Windows) to render the content.

⸻

Sources:
	•	Official React Native Windows & macOS documentation (Microsoft) for environment setup and native modules ￼ ￼ ￼ ￼
	•	React Native documentation on integration with existing apps and communication bridges ￼ ￼ ￼
	•	Microsoft DevBlogs and DevClass articles on using React Native in Office and embedding RN in native apps ￼ ￼
	•	Example code references for OpenGL (macOS) and DirectX (Windows) triangle rendering ￼ ￼ ￼ ￼
	•	Reddit summary of React Native team’s recommendation to use Expo and frameworks ￼ ￼ for cross-platform development advantages.