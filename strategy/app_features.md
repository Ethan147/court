
## Overview

- Supports tennis, pickleball and racquetball
    - racquetball might be added, but it's not a big priority (maybe build in basics but release support until after MVP)
- Helps people schedule tennis/pickleball matches & competitions easily for a reasonable price
- Allows regional connection other players, microblogging, and easy & fun competition

## Monetization

- Freemium model
    - small previews of premium features given to free tier, but rate-limited (similar to DuoLingo heart limiting)

## Free Features

- User profile
    - includes metrics like user-responsiveness, previous match records
    - rating of experience hitting with this partner
    - graph of skill level over time
    - badges user has accumulated
    - profile picture & banner
    - user reports their schedule availability for tennis
        - e.g. all day every day / thursdays at 6 am / etc
    - user reports what skill levels they are interested in hitting with
        - that way they can avoid challenges etc by people who are too inexperienced etc
- Court profile
    - star-rated courts in your area
    - include qualifiers like noise level, windscreens, lights, hitting boards, net & court-top condition
    - public playing hours, whether park is public or private, what is and isn't a school, etc
    - use icons in court-search so that users can easily see which courst have what features
- User ranking
    - users app-points compared to their region (similar to Strava routes, allowing you to see top performers in your region)
    - app-points can be gained by logging various tennis/pickleball actions
        - hitting against a wall
        - practicing serves
        - hitting with a friend/opponent
        - playing a match with a friend/opponent
        - calories burned will be reported to the user & translated into points of some sort
- Regional micro-blogging
    - access to view public posts of what's happening in your area
        - who played who & scoring reports
        - individual micro blogging of practice experience, etc
- Partner finding
    - some access to finding a hit-partner
        - will need to decide how limited this access is
            - do we restrict filters?
            - do we restrict search results?
            - do we allow unlimited searching to hook people?
    - some access to challenging a partner to a game
        - this will be rate limited per free users
        - users cannot report official game-scores if they are free members that have exhausted their rate-limited challenges
            - users can still play a game, can still report their scores via microblogging if they would like, but they cannot post the score officially (so no points / proper recognition within the community)
- In app communication
    - Some communication solution so you don't have to give out your phone number or email out to random people
- Skill level tracking
    - user will enter their estimated skill level when signing up, but afterwards skill level will be tracked algorithmically
    - for tennis UTR, NTRP rankings that are available for the user to see
    - for pickleball UTPR, IPTPA rankings that are available for the user to see
    - rankings will be tracked internally similar to ELO (likely managed by Glicko-2)
    - rankings are updates when a user partipates in some official challenge (individual, challenge ladder, tournaments)
        - this is naturally limited by a users number of free challenges
- Easy invite
    - Quick invite links / user importing etc for getting your friends on the platform
- Event experience rating
    - post-event popup (Smashrun / Uber / Lyft style)
        - report on how the game went (star rating for user satisfaction)
        - comment field for how the user behaved etc (complicments or warnings) - including what was good about their gameplay
        - how even the match felt (to track our elo features)
- Limited access (x/year) features
    - challenge ladders
    - tournaments
    - personal challenges

## Premium Features

- Regional challenges
    - challenge ladders
        - standard "challenge 1 or 2 ahead of you"
    - tournaments
        - played out over the course of weeks, to allow for adult schedules
    - indivudal user challenge
        - find a user and challenge them individually
    - challenge ladders & tournaments will be "opt in" & will be populated algorithmically according to skill levels
    - users will have access to challenge / compete anywhere they could regionally drive to
        - it's possible that this will self-select, and that there won't be a need for algorithmically limiting this
    - badges and fun reports available only to premium members
        - similar to strava badges
- Tennis secretary
    - Will schedule games for you according to what availability you have, what players in your area are near your skillset, etc
    - Ties in to National weather API & can auto-reschedule / handle logistics if weather is bad
        - considers heat, snow, rain, wind, etc
- Fun regional reports
    - custom regional data
        - who has improved the most (based on ELO)
        - who has won the most games / has the best play-record
        - who has lost the most (anonimized)
        - see where in your city is the most "hot", how many players are in what areas etc
- Flexible organization
    - Organize your own leages, groups, tournaments, challenge laddders, etc
        - In case places like pflugerville etc still want their own custom area
- Regional adaptivity
    - For snowy climates, can prompt you to pause your subscription until spring hits
- Learners league
    - access to other true beginners
    - coordination of group lessons
        - in the beginning this can just be a schedule-coordination of beginners who want to share a coach

## Staring up market

- Premium is offered to everyone for x months for free if there are not enough premium members in a market to support competitive features (probably offered to first ~100 in a region)
    - user would have to enter in credit card to join (auto charge when this expires)
    - this feature will allow for markets to jump-start themselves
- Premium in exchange for content
    - premium for x months offered in exchange for others using your signup code to start their premium
    - premium offered for particularly good blog posts to put on the company blog, etc

## Expansion strategy

- Target Texas cities first (playable year round due to weather)
    - target via strategies mentioned in the "Traction" book

## Long term road map

- partnership with clubs and other reservable courst
    - allow for auto-reserving of reservable courts for matchmaking for additional fee
- integration with apple watch
- support for doubles play
    - although this may be a required feature for many to engage in the app, it's likely an important feature
- eventually think about round-robin "earn your court" play
- add support for coaches to advertise / coordinate group lessons / etc
- ingegration with garmin / apple watch
- possibly tiered subscriptions
    - e.g. managing your own league etc could be a step above premium
