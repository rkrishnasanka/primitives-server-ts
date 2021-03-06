import Template from "./template";
import paper from "paper";
import ComponentPort from "../core/componentPort";
import { LogicalLayerType  } from "../core/init";

export default class DropletGeneratorFlowFocus extends Template {
    constructor() {
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            position: "Point"
        };

        this.__heritable = {
            componentSpacing: "Float",
            oilChannelWidth: "Float",
            waterChannelWidth: "Float",
            length: "Float",
            radius: "Float",
            angle: "Float",
            height: "Float",
            rotation: "Float"
        };

        this.__defaults = {
            componentSpacing: 1000,
            oilChannelWidth: 0.4 * 1000,
            waterChannelWidth: 0.2 * 1000,
            length: 3 * 1000,
            radius: 500,
            angle: 45,
            height: 250,
            rotation: 0
        };

        this.__units = {
            componentSpacing: "μm",
            oilChannelWidth: "μm",
            height: "μm",
            waterChannelWidth: "μm",
            radius: "μm",
            length: "μm",
            rotation: "°",
            angle: "°"
        };

        this.__minimum = {
            componentSpacing: 0,
            oilChannelWidth: 1,
            waterChannelWidth: 1,
            length: 1,
            radius: 1,
            angle: 1,
            rotation: 0
        };

        this.__maximum = {
            componentSpacing: 10000,
            oilChannelWidth: 2000,
            waterChannelWidth: 2000,
            length: 20000,
            angle: 360,
            height: 1200,
            radius: 2000,
            rotation: 360
        };

        this.__featureParams = {
            componentSpacing: "componentSpacing",
            position: "position",
            oilChannelWidth: "oilChannelWidth",
            waterChannelWidth: "waterChannelWidth",
            length: "length",
            angle: "angle",
            height: "height",
            rotation: "rotation",
            radius: "radius"
        };

        this.__targetParams = {
            componentSpacing: "componentSpacing",
            oilChannelWidth: "oilChannelWidth",
            waterChannelWidth: "waterChannelWidth",
            length: "length",
            angle: "angle",
            height: "height",
            rotation: "rotation",
            radius: "radius"
        };

        this.__placementTool = "componentPositionTool";

        this.__toolParams = {
            position: "position"
        };

        this.__renderKeys = ["FLOW"];

        this.__mint = "DROPLET GENERATOR FLOW FOCUS";

        this.__zOffsetKeys = {
            FLOW: "height"
        };

        this.__substrateOffset = {
            FLOW: "0"
        };
    }

    getPorts(params: { [k: string]: any }) {
        const ports = [];

        ports.push(new ComponentPort(0, 0, "1", LogicalLayerType.FLOW));

        // Out
        return ports;
    }

    render2D(params: { [k: string]: any }, key: string) {
        const pos = params.position;
        const x = pos[0];
        const y = pos[1];
        const color = params.color;
        const oilChannelWidth = params.oilChannelWidth;
        const waterChannelWidth = params.waterChannelWidth;
        const length = params.length;
        const angle = params.angle;
        const radius = params.radius;
        const rotation = params.rotation;

        const ret = new paper.CompoundPath("");

        // middle path
        let topLeft = new paper.Point(x - length / 3 - 2 * length, y - waterChannelWidth / 2);
        let bottomRight = new paper.Point(x, y + waterChannelWidth / 2);

        ret.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        let circ = new paper.Path.Circle(new paper.Point(x - length / 3 - 2 * length, y), radius);

        ret.addChild(circ);
        // top tilt path
        const Hlength = length / Math.cos((angle * Math.PI) / 180);

        topLeft = new paper.Point(x - length / 3 - Hlength, y - oilChannelWidth / 2);
        bottomRight = new paper.Point(x - length / 3, y + oilChannelWidth / 2);

        let tiltBlock = new paper.Path.Rectangle(topLeft, bottomRight);
        tiltBlock.rotate(angle, new paper.Point(x - length / 3, y));

        ret.addChild(tiltBlock);

        // bottom tilt path
        tiltBlock = new paper.Path.Rectangle(topLeft, bottomRight);
        tiltBlock.rotate(-angle, new paper.Point(x - length / 3, y));

        ret.addChild(tiltBlock);

        // top part
        const disFromMid = Hlength * Math.sin((angle * Math.PI) / 180);
        const angleS = 90 - angle;
        const seamCover = (oilChannelWidth / 2) * Math.tan((angleS * Math.PI) / 180);

        topLeft = new paper.Point(x - length / 3 - length - oilChannelWidth / 2, y - disFromMid - (2 * length) / 3 + seamCover);
        bottomRight = new paper.Point(x - length / 3 - length + oilChannelWidth / 2, y - disFromMid + seamCover);

        ret.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        topLeft = new paper.Point(x - length / 3 - 2 * length, y - disFromMid - (2 * length) / 3 + seamCover);
        bottomRight = new paper.Point(x - length / 3 - length - oilChannelWidth / 2, y - disFromMid - (2 * length) / 3 + oilChannelWidth + seamCover);

        ret.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        circ = new paper.Path.Circle(new paper.Point(x - length / 3 - 2 * length, y - disFromMid - (2 * length) / 3 + seamCover + oilChannelWidth / 2), radius);

        ret.addChild(circ);

        // bottom part
        topLeft = new paper.Point(x - length / 3 - length - oilChannelWidth / 2, y + disFromMid + (2 * length) / 3 - seamCover);
        bottomRight = new paper.Point(x - length / 3 - length + oilChannelWidth / 2, y + disFromMid - seamCover);

        ret.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        topLeft = new paper.Point(x - length / 3 - 2 * length, y + disFromMid + (2 * length) / 3 - seamCover);
        bottomRight = new paper.Point(x - length / 3 - length - oilChannelWidth / 2, y + disFromMid + (2 * length) / 3 - oilChannelWidth - seamCover);

        ret.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        circ = new paper.Path.Circle(new paper.Point(x - length / 3 - 2 * length, y + disFromMid + (2 * length) / 3 - seamCover - oilChannelWidth / 2), radius);

        ret.addChild(circ);

        // Rotate the geometry
        ret.rotate(-rotation, new paper.Point(pos[0], pos[1]));

        ret.closed = true;
        ret.fillColor = color;
        return ret;
    }

    render2DTarget(key: string, params: { [k: string]: any }) {
        const render = this.render2D(params, key);
        render.fillColor!.alpha = 0.5;
        return render;
    }
}
