# rest-framework
Playground for developing a down and dirty, rest centric node framework.

Thoughts while working:
1) Switching from OO to "Light and fast single threaded" is proving to be a fun challenge.
2) I'm confused if I should be using a more functional approach, or more OO approach, like I usually do when I am
    writing javascript. All the examples I am seeing rely on frameworks. I wrote servlets and EJBs back in the day.
    I can do this.
3) I have a feeling bullet proofing this thing is going to prove challenging.. so I may simply rely on infrastructure
    for some things. One error bubbles up and it kills the whole server. Cheap try catch ALL? May worth it for now.
4) Do I have time to build a full on markup to object mapper (Jackson-like in nature?)
    Probably not... but worth trying to do.
5) Went down the road of connecting to mongo, but I think it over complicates this. Fun Anecdote: Bob Martin tells a
    story about being deep into a project and only realizing late in the game that a simple set of in memory maps had
    been providing all the storage capability they needed.
6)
