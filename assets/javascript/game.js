$(document).ready(function () {

    class Character {
        constructor(name, picture, attackPower, counterAttackPower, HP) {
            this.name = name;
            this.picture = picture;
            this.attackPower = attackPower;
            this.counterAttackPower = counterAttackPower;
            this.HP = HP;
        }
    }

    let wicket = new Character("Wicket", "<img src='assets/images/Wicket-small.png' />", 6, 7, 100);
    let weazel = new Character("Weazel", "<img src='assets/images/Weazel-small.png' />", 9, 5, 90);
    let wodibin = new Character("Wodibin", "<img src='assets/images/Wodibin-small.png' />", 2, 10, 140);
    let wollivan = new Character("Wollivan", "<img src='assets/images/Wollivan-small.png' />", 3, 9, 120);
    let boss = new Character("Professor Flitwick", "<img src='assets/images/flitwick.png' />", 1, 2, 280);

    let characters = [wicket, weazel, wodibin, wollivan];
    let numAttacks = 0;
    let defenderSelected = false;
    let bossDefeated = false;

    function createButton(text, id) {
        let btn = $("<button>");
        btn.text(text);
        btn.attr("id", id);
        return btn;
    }

    let restartBtn = createButton("Restart", "restartBtn");
    let bossBtn = createButton("Restart", "bossBtn");
    let attackBtn = createButton("Attack", "attackBtn");

    function addCharacter(character, row) {
        let newDiv = $("<div>");
        let newDivPic = $("<div>");
        let newDivStats = $("<aside>");

        newDiv.attr("class", "character-option");
        newDiv.attr("name", character.name);
        newDiv.attr("attackPower", character.attackPower);
        newDiv.attr("counterAttackPower", character.counterAttackPower);
        newDiv.attr("HP", character.HP);
        newDiv.append(character.name);

        newDivPic.attr("class", "character-pic");
        newDivPic.append(character.picture);
        newDiv.append(newDivPic);

        newDivStats.attr("class", "character-stats");
        newDivStats.append("Attack Power: " + newDiv.attr("attackPower") + "<br>");
        newDivStats.append("HP: " + newDiv.attr("HP"));
        newDiv.append(newDivStats);

        row.append(newDiv)
    }

    function selectCharacter(character) {
        // If character clicked is from character-select menu
        if (character.parent().attr("id") === "character-row") {
            selectAttacker(character);
        }
        // Else if character clicked is from enemy-select menu (and an enemy hasn't already been selected)
        else if (character.parent().attr("id") === "enemies-row" && !defenderSelected) {
            selectDefender(character);
        }
    }

    function selectAttacker(character) {
        //Display various menu headings
        $("#attacker-menu").prepend("<p>Your character:</p>")
        $("#enemies-menu").prepend("<p>Select an opponent:</p>")
        $("#defender-menu").prepend("<p>Defender:</p>");

        // Move character to 'Your Character' attacker menu section 
        $("#attacker-row").append(character);
        character.attr("class", "attacker-option");

        // Move other characters to enemies menu to select an opponent
        $("#enemies-row").append($("#character-row").contents());

        // Give each character in enemies menu enemy properties
        $('#enemies-row').children($('.character-option')).each(function () {
            convertToEnemy($(this));
        });

        // Hide original character-select menu
        $("#character-menu").hide();
    }

    function convertToEnemy(character) {
        character.attr("class", "enemies-option");

        // Remove attack power stat from displaying
        character.find($(".character-stats")).empty();
        character.find($(".character-stats")).append("HP: " + character.attr("HP"));
    }

    function selectDefender(character) {
        defenderSelected = true;

        // Move character to 'Defender' section 
        $("#defender-row").empty();
        $("#defender-row").append(character);

        // Show attack button
        $("#attackBtn").show();

        // Clear old message
        $("#message").empty();

        // // Add character-option class with defender-option class
        character.attr("class", "defender-option");

        // Hide enemies-menu temporarily
        $("#enemies-menu").hide();

        // Show fight-section and defender menu again
        $("#fight-section").show();
        $("#defender-menu").show();
    }

    function attack() {
        if (defenderSelected) {
            // Calculate damage variables
            let defender = $(".defender-option");
            numAttacks++;
            let attackerHP = parseInt($(".attacker-option").attr("HP"));
            let defenderHP = parseInt(defender.attr("HP"));
            let currentAttack = parseInt($(".attacker-option").attr("attackPower")) * numAttacks;
            let counterAttack = parseInt(defender.attr("counterAttackPower"));
            attackerHP = attackerHP - counterAttack;
            defenderHP = defenderHP - currentAttack;

            // Update message
            $("#message").html("You dealt " + currentAttack + " damage to " + defender.attr("name") + ". <br>" + defender.attr("name") + " dealt you " + counterAttack + " damage.");

            // Update character stats for attacker and defender
            $(".attacker-option").attr("HP", attackerHP);
            defender.attr("HP", defenderHP);
            $(".attacker-option").find($(".character-stats")).empty();
            $(".attacker-option").find($(".character-stats")).append("Attack Power: " + currentAttack + "<br>");
            $(".attacker-option").find($(".character-stats")).append("HP: " + attackerHP);
            defender.find($(".character-stats")).empty();
            // defender.find($(".character-stats")).append("Counter Power: " + counterAttack + "<br>");
            defender.find($(".character-stats")).append("HP: " + defenderHP);

            // Upon player death
            if (attackerHP <= 0) {
                // Add Restart button 
                $("#restart").append(restartBtn);

                // Hide attack button
                $("#attackBtn").hide();

                // Display losing message
                $("#message").text("You've been defeated!")
            }
            // Upon opponent death
            else if (defenderHP <= 0) {

                // If defender is the boss set variable bossDefeated to true
                if (defender.attr("name") == boss.name) {
                    bossDefeated = true;
                }

                //Remove opponent
                defender.detach();
                defenderSelected = false;

                // Hide defender menu
                $("#defender-menu").hide();

                // If active enemies remain
                if ($('.enemies-option').length !== 0) {
                    // Hide fight-section until new opponent is selected
                    $("#fight-section").hide();

                    // Show enemies menu again
                    $("#enemies-menu").show();
                    $("#message").text("You defeated " + defender.attr("name") + "!")
                }
                else {
                    // Hide attack button
                    $("#attackBtn").hide();

                    // Display winning message
                    $("#message").text("All opponents defeated! Warwick Davis would be proud.")

                    if (!bossDefeated) {
                        $("#boss").append(bossBtn);
                    }
                    else {
                        // Add Restart button
                        $("#restart").append(restartBtn);

                        // Display final winning message
                        $("#message").text("Well done! You staved off the Wizarding World invasion of the Star Wars universe!")
                    }
                }
            }
        }
        else {
            $("#message").empty();
            $("#defender-row").text("<p>No opponent selected.</p>")
        }
    }

    function startBoss() {
        let bossOption = $('#boss-row').children($('.character-option'))

        $("#boss").empty();

        // Give boss the enemies-option class
        bossOption.attr("class", "enemies-option");

        // Move boss character to enemies menu to select an opponent
        $("#enemies-row").append($("#boss-row").contents());

        // Remove attack power stat from displaying
        bossOption.find($(".character-stats")).empty();
        bossOption.find($(".character-stats")).append("HP: " + bossOption.attr("HP"));

        // Show enemies menu again
        $("#enemies-menu").show();

        $("#message").text("What's this? " + boss.name + "!? Warwick Davis' cinematic universes are colliding!")
    }

    let startGame = function initGame() {

        // Display character selection menu
        characters.forEach(function (element) {
            addCharacter(element, $("#character-row"));
        });
        $("#character-menu").prepend("<p>Select a character:</p>")

        // Hide fight-section and defender menu until attacker and defender are selected
        $("#fight-section").hide();
        $("#defender-menu").hide();

        // Add attack button
        $("#fight-section").prepend(attackBtn);

        // Add boss in hidden boss selection menu
        $("#boss-row").hide();
        addCharacter(boss, $("#boss-row"));

    };

    startGame();

    // Upon clicking a character 
    $(".character-option").on("click", function () {
        selectCharacter($(this));
    });

    // Upon clicking attack button
    $("#attackBtn").on("click", function () {
        attack();
    });

    // Upon clicking restart button
    $("#restart").on("click", restartBtn, function () {
        document.location.reload(true);
    });

    // Upon clicking "false" restart button AKA boss button
    $("#boss").on("click", bossBtn, function () {
        startBoss();
    });

    // OPTIONAL KEY-PRESS HANDLER (INSTEAD OF CLICKING BUTTONS OR CHARACTERS)
    document.onkeyup = function (event) {
        let input = event.key.toUpperCase();
        let attackBtnVisible = $("#attackBtn").is(":visible");
        let restartBtnVisible = restartBtn.is(":visible");
        let bossBtnVisible = bossBtn.is(":visible");
        let characterMenuVisible = $("#character-menu").is(":visible");
        let enemiesMenuVisible = $("#enemies-menu").is(":visible");

        // ATTACK USING "A" OR "ENTER"
        if ((input === "A" || input === "ENTER") && attackBtnVisible) {
            attack();
        }
        // RESTART USING "R" OR "ENTER"
        else if ((input === "R" || input === "ENTER") && restartBtnVisible) {
            document.location.reload(true);
        }
        // "FAKE" RESTART AKA START BOSS FIGHT USING "R" OR "ENTER"
        else if ((input === "R" || input === "ENTER") && bossBtnVisible) {
            startBoss();
        }
        // SELECT CHARACTERS OR ENEMIES USING NUMBERS "1,2,3,4"
        else if (!isNaN(input) && parseInt(input) > 0) {
            if (characterMenuVisible && input <= $(".character-option:visible").length) {
                let counter = 0;
                $('#character-row').children($('.character-option:visible')).each(function () {
                    counter++;
                    if (parseInt(input) === counter) {
                        selectCharacter($(this));
                    }
                });
            }
            else if (enemiesMenuVisible && input <= $(".enemies-option:visible").length) {
                let counter = 0;
                $('#enemies-row').children($('.enemies-option:visible')).each(function () {
                    counter++;
                    if (parseInt(input) === counter) {
                        selectCharacter($(this));
                    }
                });
            }
        }
    }
});