
# SMS Expense Tracker

**SMS Expense Tracker** is a React Native app built using Expo that allows users to read SMS messages on their device and extract expense-related information. The app parses SMS messages to collate transaction details such as amounts, descriptions, dates, and more, displaying this information in a neat and organized table format.

The app also supports real-time updates, so if a new expense-related SMS is received, it will be immediately reflected in the app.

## Features

- **Read SMS Messages**: Automatically fetches all SMS messages from the device.
- **Expense Detection**: Identifies expense-related messages using regex to extract:
  - Transaction amount
  - Description
  - Date
  - Type of transaction (Credited/Debited)
- **Organized Display**: Expenses are displayed in a user-friendly table with detailed views for each transaction.
- **Interactive Modal**: Users can view full SMS descriptions by clicking a button.


## Installation Guide

### Prerequisites

This app is built using Expo's **prebuild** workflow, which allows you to target native code easily. Before starting, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) or npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio with SDK tools (for Android development)
- A Physical Device

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Prathamdas3/sms_app.git
   cd sms_app
   ```

2. **Install dependencies**:

   Install the required packages using Yarn or npm:

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Prebuild the app**:

   Since this app uses the prebuild workflow to include native code (for accessing SMS), you'll need to run the prebuild step to generate the necessary Android/iOS project files:

   ```bash
   expo prebuild
   ```

   This will generate the `android` and `ios` directories containing native code. Ensure that Android Studio is correctly configured for Android development.

4. **Build the app**:

   Once the prebuild step is complete, you can run the app on an Android emulator or a physical device:

   ```bash
   expo run:android
   ```

   > **Note**: As of now, this project supports only Android since SMS permissions and access are platform-specific. Ensure you have the necessary permissions granted on your device.

5. **Grant SMS Permissions**:

   On your Android device, make sure the app has permission to read SMS messages. You may be prompted during installation, but you can also manually enable it in your device's settings.


## How It Works

- The app uses the [`react-native-get-sms-android`](https://www.npmjs.com/package/react-native-get-sms-android) package to access and list SMS messages on Android devices.
- A regex pattern is used to extract key financial information such as the date, amount, transaction type, and details from SMS messages typically sent by banks or payment apps.
- The SMS messages are displayed in a clean table, with a modal for additional details.
- Real-time updates are handled using `DeviceEventEmitter`, allowing the app to respond to new SMS messages as they arrive.




