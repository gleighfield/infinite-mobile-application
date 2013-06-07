package com.gelstudios.infinite;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;

import com.urbanairship.UAirship;
import com.gelstudios.infinite.PushNotificationPluginIntentReceiver;
import com.urbanairship.push.PushManager;
import com.urbanairship.AirshipConfigOptions;

public class infiniteApp extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onStart() {
        super.onStart();
        UAirship.shared().getAnalytics().activityStarted(this);
    }

    @Override
    public void onStop() {
        super.onStop();
        UAirship.shared().getAnalytics().activityStopped(this);
    }
}

