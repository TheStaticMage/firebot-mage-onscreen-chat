# Avoiding Browser Source Refreshes

## Introduction

The recommended settings in the [configuration](/doc/installation.md#configuration-obs) instruct OBS not to automatically refresh the browser source when it becomes available. However, if OBS is not continuously processing updates to the browser source, you could experience another undesirable effect: if the chat display is shown after a period of being hidden, all of the chat messages might come flooding in (instead of "just being there").

I wanted to make sure that OBS always has the browser source loaded so that updates will always be processed. That way, if the browser source is displayed after a while of being hidden, it is already caught up.

## My solution

1. Create a new scene in OBS -- I call mine "Hidden Chat".

2. Add the browser source for the on-screen chat. Or if you are using a nested scene with the on-screen chat, add that scene.

3. Edit the transform so the browser source displays off the edge of the screen. (For example: set the left coordinate to 1921 or the top coordinate to 1081 for a 1920x1080 screen.)

4. Make sure that the "Hidden Chat" scene is always displayed in OBS.

    - You could add the "Hidden Chat" scene to all of your other scenes manually.
    - You could use [Exeldro's Downstream Keyer plugin](https://obsproject.com/forum/resources/downstream-keyer.1254/) to have OBS always display the "Hidden Chat" scene automatically.

The beauty of this solution is that the "Hidden Chat" scene is completely transparent to your viewers, but it keeps the browser source for the chat display loaded so that it receives updates continuously.
