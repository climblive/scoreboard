#!/bin/bash

SOURCE=/home/travis/uploads
TARGET=/opt/climblive

inotifywait -m -e moved_to --format "%f" $SOURCE \
    | while read FILENAME
        do
            chown climblive:root $SOURCE/$FILENAME
            chmod u+x $SOURCE/$FILENAME
            mv $SOURCE/$FILENAME $TARGET
            rm -f $TARGET/climblive.jar
            ln -s $TARGET/$FILENAME $TARGET/climblive.jar
            systemctl restart climblive
	    curl -X POST --data "{\"text\": \">Deployed *$FILENAME* on $(hostname)\"}" https://hooks.slack.com/services/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
        done
