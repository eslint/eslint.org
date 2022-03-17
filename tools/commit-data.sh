#!/bin/bash

#------------------------------------------------------------------------------
# Commits the data files if any have changed
#------------------------------------------------------------------------------

if [ -z "$(git status --porcelain)" ]; then 
	echo "Data did not change."
else
	echo "Data changed!"

	# commit the result
	git add src/_data/
	git commit -m "chore: Update remote data"

	# push back to source control
	git push origin HEAD  
fi
