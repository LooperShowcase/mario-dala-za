kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [1, 0, 1.5, 1], //rgba -> red green blue alfa
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("surprise_star", "star.png");
loadSprite("princes", "princes.png");
loadSprite("mushroom", "mushroom.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("star", "star.png");
loadSprite("coin", "coin.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("heart", "heart.png");
let score = 0;
let hearts = 3;
scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "     ============                   ====           ===                             ===         ",
    "    =                                    ===== ==========             ========          ===    ",
    "                   =======  ===========                =======                                 ",
    "     ==========                    ======          =====                                       ",
    "                          ==                                         ======                    ",
    "     ================   =========              ====         ==          ====                   ",
    "              ===           ===              =========     ==     ============     ===         ",
    "                                   ==                  ========                =========       ",
    "        ^                 ==         *        ======  ======            === =           ====   ",
    "                      p  ====            ======                ==== ====     =====             ",
    "=======================m=========       ==============                =======        =====     ",
    "        ==============        ==   =              ===========    ==== ===          ===        0 ",
    "                  ===    ===============   ====        === ===      =======                  e ",
    "     ==               ====     ======            ==================   =======   ======  ==     ",
    "==========    =========================    ===========    =====================================",
    "===============================================================================================",
  ];
  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    p: [sprite("princes"), solid(), "princes", body()],
    m: [sprite("mushroom"), solid(), "mushroom"],
    "*": [sprite("surprise"), solid(), "surprise_coin"],
    "^": [sprite("surprise"), solid(), "surprise_star"],
    "#": [sprite("star"), solid(), "star", body()],
    "!": [sprite("coin"), "coin"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    e: [sprite("pipe"), solid(), "pipe"],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);
  const scoreLabel = add([text("score: 0")]);
  const heartObj = add([
    sprite("heart"),
    text("     x3", 12),
    origin("center"),
  ]);
  keyDown("right", () => {
    player.move(150, 0);
  });
  keyDown("left", () => {
    player.move(-150, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(CURRENT_JUMP_FORCE);
      play("jump");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("!", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(20, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    if (player.isbig()) {
      score += 4;
    } else {
      score += 2;
    }
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(4);
  });
  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    heartObj.pos = player.pos.sub(400, 170);
    heartObj.text = "     x" + hearts;
    scoreLabel.text = "score :" + score;
    if (player.pos.y > 500) {
      hearts--;
    }
    if(hearts <=0) {
      go("lose");
    }
  });
  action("princes", (obj) => {
    obj.move(-40, 0);
  });
  let lastGrounded = true;
  player.collides("princes", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });

  player.action(() => {
    lastGrounded = player.grounded();
  });

  // scene end
});
scene("lose", () => {
  hearts = 3;
  add([
    text("Game over\nYou lost", 60),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([text("you win", 60), origin("center"), pos(width() / 2, height() / 2)]);
  keyDown("space", () => {
    go("level2");
  });
  add([
    text("press (space) to restart", 10),
    origin("center"),
    pos(width() / 2, 320),
  ]);
});

scene("level2", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "     ============                   ====           ===                             ===         ",
    "    =                    p               ===== ==========             ========          ===    ",
    "              =    =======  ===========                =======                                 ",
    "      =       =                              =                                                 ",
    "      =       =            ==                =                        ======                   ",
    "      =       =                              =                                                 ",
    "      =       =                              =                                                 ",
    "      =       =                     ==                       ===                =========      ",
    "        ^     =            ==         *        ======  ======            === =           ====  ",
    "              =           ====            ======                ====          =====            ",
    "                                                                                               ",
    "        ==============        ==   =                                  ===                      ",
    "                  ===                      ====        === ===      =======                  e ",
    "     ==               ====     ======            ==================   =======   ======  ==     ",
    "==========                                                                                     ",
    "===============================================================================================",
  ];
  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    p: [sprite("princes"), solid(), "princes", body()],
    m: [sprite("mushroom"), solid(), "mushroom"],
    "*": [sprite("surprise"), solid(), "surprise_coin"],
    "^": [sprite("surprise"), solid(), "surprise_star"],
    "#": [sprite("star"), solid(), "star", body()],
    "!": [sprite("coin"), "coin"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    e: [sprite("pipe"), solid(), "pipe"],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);
  const scoreLabel = add([text("score: 0")]);
  keyDown("right", () => {
    player.move(150, 0);
  });
  keyDown("left", () => {
    player.move(-150, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(CURRENT_JUMP_FORCE);
      play("jump");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("!", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(20, 0);
  });

  player.collides("coin", (obj) => {
    score += 2;
    destroy(obj);
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(4);
  });
  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score :" + score;
    if (player.pos.y > 500) {
      go("lose");
    }
  });
  action("princes", (obj) => {
    obj.move(-40, 0);
  });
  let lastGrounded = true;
  player.collides("princes", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });

  player.action(() => {
    lastGrounded = player.grounded();
  });

  // scene end
});
start("game");
