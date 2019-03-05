/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jshint unused: vars*/

(function() {
    var XML_ADDRESS = "https://clmb.live/api/contender/sadsadsd",
        XML_METHOD = "GET",
        MSG_ERR_NODATA = "There is no news from tizen.org",
        MSG_ERR_NOTCONNECTED = "Connection aborted. Check your internet connection.",
        NUM_MAX_NEWS = 5,
        NUM_MAX_LENGTH_SUBJECT = 64,
        arrayNews = [],
        indexDisplay = 0,
        lengthNews = 0;

    /**
     * Removes all child of the element.
     * @private
     * @param {Object} elm - The object to be emptied
     * @return {Object} The emptied element
     */
    function emptyElement(elm) {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }

        return elm;
    }

    /**
     * Handles the hardware key events.
     * @private
     * @param {Object} event - The object contains data of key event
     */
    function keyEventHandler(event) {
    		console.log("SCOREBOARD keyEventHandler", event);
        if (event.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    }

    /**
     * Adds a text node with specific class to an element.
     * @private
     * @param {Object} objElm - The target element to be added the text
     * @param {string} textClass - The class to be applied to the text
     * @param {string} textContent - The text string to add
     */
    function addTextElement(objElm, textClass, textContent) {
        var newElm = document.createElement("p");

        newElm.className = textClass;
        newElm.appendChild(document.createTextNode(textContent));
        objElm.appendChild(newElm);
    }

    /**
     * Cuts the text by length and put ellipsis marks at the end if needed.
     * @private
     * @param {string} text - The original string to be cut
     * @param {number} maxLength - The maximum length of the string
     */
    function trimText(text, maxLength) {
        var trimmedString;

        if (text.length > maxLength) {
            trimmedString = text.substring(0, maxLength - 3) + "...";
        } else {
            trimmedString = text;
        }

        return trimmedString;
    }

    /**
     * Displays a news and page number of the selected index.
     * @private
     * @param {number} index - The index of the news to be displayed
     */
    function showNews(index) {
        var objNews = document.querySelector("#area-news"),
            objPagenum = document.querySelector("#area-pagenum");

        emptyElement(objNews);
        addTextElement(objNews, "subject", arrayNews[index].title);
        emptyElement(objPagenum);
        addTextElement(objPagenum, "pagenum", "Hej3 " + (index + 1) + "/" + lengthNews);
    }

    /**
     * Displays a news of the next index.
     * @private
     */
    function showNextNews() {
        if (lengthNews > 0) {
            indexDisplay = (indexDisplay + 1) % lengthNews;
            showNews(indexDisplay);
        }
    }

    /**
     * Reads data from internet by XMLHttpRequest, and store received data to the local array.
     * @private
     */
    function getDataFromXML() {
    	    	
        var objNews = document.querySelector("#area-news"),
            xmlhttp = new XMLHttpRequest(),
            xmlDoc,
            dataItem,
            i;

        arrayNews = [];
        lengthNews = 0;
        indexDisplay = 0;
        emptyElement(objNews);

        xmlhttp.open(XML_METHOD, XML_ADDRESS, false);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            		console.log("RESPONSE" + xmlhttp.responseText);
                xmlDoc = xmlhttp.responseXML;
                dataItem = xmlDoc.getElementsByTagName("item");

                if (dataItem.length > 0) {
                    lengthNews = (dataItem.length > NUM_MAX_NEWS) ? NUM_MAX_NEWS : dataItem.length;
                    for (i = 0; i < lengthNews; i++) {
                        arrayNews.push({
                            title: dataItem[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
                            link: dataItem[i].getElementsByTagName("link")[0].childNodes[0].nodeValue
                        });
                        arrayNews[i].title = trimText(arrayNews[i].title, NUM_MAX_LENGTH_SUBJECT);
                    }

                    showNews(indexDisplay);
                } else {
                    addTextElement(objNews, "subject", MSG_ERR_NODATA);
                }

                xmlhttp = null;
            } else {
                addTextElement(objNews, "subject", MSG_ERR_NOTCONNECTED);
            }
        };

        xmlhttp.send();
    }

    /**
     * Sets default event listeners.
     * @private
     */
    function setDefaultEvents() {
        document.addEventListener("tizenhwkey", keyEventHandler);
        document.querySelector("#area-news").addEventListener("click", showNextNews);
    }

    function openWithCode(code) {
		console.log("open with code " + code);
    		api.getContender(code, function(result) {
			console.log(result);
			ui.showProblems(result.problems);
		});
    }
    
    /**
     * Initiates the application.
     * @private
     */
    function init() {
		console.log("SCOREBOARD init");
        setDefaultEvents();
        
        var code = storage.getCode();
        if(code) {
        		openWithCode(code);
        } else {
        		// No code. Show the input field!
        		ui.showCode(function(code) {
        			console.log("code: " + code);
        			storage.setCode(code);
        			ui.hideCode();
        			openWithCode(code);
        		});
        }
    }

    window.onload = init;
}());