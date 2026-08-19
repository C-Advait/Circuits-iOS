## Install Instructions

Run the following code to run app.
When QR code pops up, follow instructions to run
on phone.

```
git clone git@github.com:PierrotAWB/timer.git
cd timer
npm install
npx expo start
```

Afterwards, running `npx expo start` in the
project directory is sufficient when the installed development client matches
the project's native dependencies.

## iOS simulator

After launching a new simulator, rebuild and install the development client:

```sh
npm run ios
```

This clears Xcode's native build cache before compiling, installs the resulting
app on the booted simulator, and starts Metro. Use the device picker when more
than one simulator or device is available:

```sh
npm run ios:device
```

Run one of these commands after changing Expo SDK versions or native
dependencies. Opening an older app already installed in a simulator can load a
new Metro bundle into an incompatible native client.

https://github.com/user-attachments/assets/06bbaf03-1a65-4253-a3db-f1e0468b44f8
