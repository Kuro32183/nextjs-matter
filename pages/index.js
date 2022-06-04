/* eslint-disable react/no-string-refs */
import React from "react";
import Matter from "matter-js";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      width = window.innerWidth,
      height = window.innerHeight,
      MouseConstraint = Matter.MouseConstraint;

    var engine = Engine.create({
      // positionIterations: 20
    });

    var render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        pixelRatio: "auto",
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
        wireframeBackground: "transparent",
      },
    });
    Render.run(render);

    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    var ballA = Bodies.circle(170, 50, 20, {
      density: 0.05,
      frictionAir: 0.03,
      friction: 0.05,
      restitution: 0.1,
      render: {
        sprite: {
          texture: "/gama1.png",
        },
      },
    });
    var ballB = Bodies.circle(200, 50, 20, {
      render: {
        density: 0.08,
        frictionAir: 0.06,
        friction: 0.05,
        restitution: 0.1,
        timeScale: 0.9,
        sprite: {
          texture: "/gama1.png",
        },
      },
    });
    var ballC = Bodies.circle(460, 50, 25, {
      render: {
        density: 0.005,
        frictionAir: 0.04,
        friction: 0.05,
        restitution: 0.1,
        sprite: {
          texture: "/gama1.png",
        },
      },
    });
    var ballD = Bodies.circle(270, 50, 20, {
      density: 0.005,
      frictionAir: 0.04,
      friction: 0.05,
      restitution: 0.1,
      render: {
        sprite: {
          texture: "/gama1.png",
        },
      },
    });
    World.add(engine.world, [
      // walls
      Bodies.rectangle(-50, 0, 50, height * 3, {
        isStatic: true,
        label: "leftWall",
      }),
      Bodies.rectangle(width + 50, 0, 50, height * 3, {
        isStatic: true,
        label: "rightWall",
      }),
      Bodies.rectangle(width / 2, height + 30, width, 90, {
        isStatic: true,
        label: "floor",
        render: {
          fillStyle: "transparent",
        },
      }),
    ]);

    setTimeout(function () {
      World.add(engine.world, ballA);
    }, 800);
    setTimeout(function () {
      World.add(engine.world, ballB);
    }, 1600);
    setTimeout(function () {
      World.add(engine.world, ballC);
    }, 2400);
    setTimeout(function () {
      World.add(engine.world, ballD);
    }, 3200);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    mouseConstraint.mouse.element.removeEventListener(
      "mousewheel",
      mouseConstraint.mouse.mousewheel
    );
    mouseConstraint.mouse.element.removeEventListener(
      "DOMMouseScroll",
      mouseConstraint.mouse.mousewheel
    );

    World.add(engine.world, mouseConstraint);

    const textures = ["/gama1.png", "/gama1.png", "/gama1.png", "/gama1.png"];

    function createBall(fruitType) {
      let textureIndex;

      if (fruitType === "one") {
        textureIndex = 0;
      } else if (fruitType === "two") {
        textureIndex = 1;
      } else if (fruitType === "three") {
        textureIndex = 2;
      } else if (fruitType === "four") {
        textureIndex = 3;
      }
      // Fruit size randomiser
      const ORIGINAL_SIZE = 100;
      const SIZE = Math.random() * 0.58 + 0.49 + 0.45; // a random number between 0.18 and 0.13
      const ball = Bodies.circle(
        Math.round(Math.random() * width), // x
        -30, // y
        (SIZE * ORIGINAL_SIZE) / 2.15, // r
        {
          angle: Math.PI * (Math.random() * 2 - 1),
          restitution: 0.5, //bouciness
          render: {
            sprite: {
              texture: textures[textureIndex],
              xScale: SIZE, // between [0, 1]
              yScale: SIZE,
            },
          },
        }
      );

      return ball;
    }

    let oneArray = [];

    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      const oneFruit = createBall("one");
      World.add(engine.world, [oneFruit]);
      oneArray.push(oneFruit);
    });

    let twoArray = [];

    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      const twoFruit = createBall("two");
      World.add(engine.world, [twoFruit]);
      twoArray.push(twoFruit);
    });

    let threeArray = [];

    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      const threeFruit = createBall("three");
      World.add(engine.world, [threeFruit]);
      threeArray.push(threeFruit);
    });

    Matter.Events.on(mouseConstraint, "mousedown", function (event) {
      const fourFruit = createBall("four");
      World.add(engine.world, [fourFruit]);
      threeArray.push(fourFruit);
    });

    var deviceOrientation = window.orientation; //デバイスの傾きを取得

    //デバイスが動くたびに実行 : devicemotion
    window.addEventListener(
      "devicemotion",
      function devicemotionHandler(event) {
        //重力加速度 (物体の重力を調節)
        var xg = event.accelerationIncludingGravity.x / 10;
        var yg = event.accelerationIncludingGravity.y / 10;

        // 傾きに応じて重力を調節
        switch (deviceOrientation) {
          case 0:
            engine.world.gravity.x = xg + event.acceleration.x;
            engine.world.gravity.y = -yg + event.acceleration.y;
            break;
          case 90:
            engine.world.gravity.x = -yg - event.acceleration.x;
            engine.world.gravity.y = -xg + event.acceleration.x;
            break;
          case -90:
            engine.world.gravity.x = yg + event.acceleration.x;
            engine.world.gravity.y = xg - event.acceleration.x;
            break;
          case 180:
            engine.world.gravity.x = -xg - event.acceleration.x;
            engine.world.gravity.y = yg - event.acceleration.x;
        }

        // androidとiOSは加速度が真逆なのでその対応
        if (window.navigator.userAgent.indexOf("Android") > 0) {
          engine.world.gravity.x = -engine.world.gravity.x;
          engine.world.gravity.y = -engine.world.gravity.y;
        }
      }
    );

    Engine.run(engine);

    Render.run(render);
  }

  render() {
    return (
      <>
        <div className="h-screen w-screen overflow-hidden">
          <div ref="scene" className="relative filter brightness-90" />
          <h1
            className="text pointer-events-none text-[4rem] md:text-[6rem] absolute bottom-[50%] left-[10%]"
            style={{ zIndex: "1" }}
          >
            Please Click!!
          </h1>
        </div>
      </>
    );
  }
}

export default Home;
