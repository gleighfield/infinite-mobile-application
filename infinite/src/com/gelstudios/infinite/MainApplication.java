package com.gelstudios.infinite;

import android.app.Application;
import android.content.Context;

import com.urbanairship.UAirship;
import com.urbanairship.push.PushManager;
import com.urbanairship.AirshipConfigOptions;

public class MainApplication extends Application {

    final static String TAG = MainApplication.class.getSimpleName();
    private static MainApplication instance = new MainApplication();

    public MainApplication() {
        instance = this;
    }

    public static Context getContext() {
        return instance;
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        //Init push config settings here.
        AirshipConfigOptions options = AirshipConfigOptions.loadDefaultOptions(this);
        options.developmentAppKey = "z6H846nbSlGBWY-7_Bk-TA";
        options.developmentAppSecret = "xsCwUPV8Q92b5FJQl5lMOA";
        options.productionAppKey = "z6H846nbSlGBWY-7_Bk-TA";
        options.productionAppSecret = "xsCwUPV8Q92b5FJQl5lMOA";
        options.gcmSender = "699992632864";
        options.developmentLogLevel = 3;
        options.productionLogLevel = 6;        		
        options.inProduction = false; //determines which app key to use
        
        UAirship.takeOff(this, options);
        if (UAirship.shared().getAirshipConfigOptions().pushServiceEnabled) {
            PushManager.enablePush();
            PushManager.shared().setIntentReceiver(PushNotificationPluginIntentReceiver.class);
        }
    }

    public void onStop() {
       UAirship.land();
    }
}
