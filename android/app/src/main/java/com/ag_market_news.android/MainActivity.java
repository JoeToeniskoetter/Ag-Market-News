package com.ag_market_news.android;
import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash; 
import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RNBootSplash.init(R.drawable.launch_screen, MainActivity.this);
    }

  @Override
  protected String getMainComponentName() {
    return "Ag Market News";
  }
}
