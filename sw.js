/* Forward old sw.js registrations to the maintained stable worker implementation.
   Prevents legacy app code from downgrading the offline version. */
importScripts('./petri-sw.js');
