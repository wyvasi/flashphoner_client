/**
 Copyright (c) 2013 Flashphoner
 All rights reserved. This Code and the accompanying materials
 are made available under the terms of the GNU Public License v2.0
 which accompanies this distribution, and is available at
 http://www.gnu.org/licenses/old-licenses/gpl-2.0.html

 Contributors:
 Flashphoner - initial API and implementation

 This code and accompanying materials also available under LGPL and MPL license for Flashphoner buyers. Other license versions by negatiation. Write us support@flashphoner.com with any questions.
 */
var UIManagerWebRtc = function () {

}

UIManagerWebRtc.prototype = {
    requestUnmute: function() {
        trace("requestUnmute");
        this.viewAccessMessage();

    },

    closeRequestUnmute: function() {
        //do nothing in case of WebRTC
    },

    viewAccessMessage: function() {
        trace("viewAccessMessage");
        flashphoner.viewAccessMessage();

    }

}
