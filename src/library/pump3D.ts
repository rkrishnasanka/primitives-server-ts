import Template from "./template";
import paper from "paper";
import ComponentPort from "../core/componentPort";
import { LogicalLayerType } from "../core/init";

export default class Pump3D extends Template {
    constructor() {
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            position: "Point"
        };

        this.__heritable = {
            componentSpacing: "Float",
            valveRadius: "Float",
            height: "Float",
            gap: "Float",
            rotation: "Float",
            spacing: "Float",
            flowChannelWidth: "Float"
        };

        this.__defaults = {
            componentSpacing: 1000,
            valveRadius: 1.2 * 1000,
            height: 250,
            gap: 0.6 * 1000,
            width: 2.4 * 1000,
            length: 2.4 * 1000,
            rotation: 90,
            spacing: 5000,
            flowChannelWidth: 300
        };

        this.__units = {
            componentSpacing: "μm",
            valveRadius: "μm",
            height: "μm",
            gap: "μm",
            width: "μm",
            length: "μm",
            rotation: "°",
            spacing: "μm",
            flowChannelWidth: "μm"
        };

        this.__minimum = {
            componentSpacing: 0,
            valveRadius: 0.1 * 100,
            height: 0.1 * 100,
            gap: 0.5 * 10,
            rotation: 0,
            spacing: 10,
            flowChannelWidth: 1
        };

        this.__maximum = {
            componentSpacing: 10000,
            valveRadius: 0.2 * 10000,
            height: 1.2 * 1000,
            gap: 0.1 * 10000,
            rotation: 360,
            spacing: 10000,
            flowChannelWidth: 10000
        };

        this.__featureParams = {
            componentSpacing: "componentSpacing",
            position: "position",
            rotation: "rotation",
            valveRadius: "valveRadius",
            flowChannelWidth: "flowChannelWidth",
            spacing: "spacing",
            gap: "gap"
        };

        this.__targetParams = {
            componentSpacing: "componentSpacing",
            rotation: "rotation",
            valveRadius: "valveRadius",
            flowChannelWidth: "flowChannelWidth",
            spacing: "spacing",
            gap: "gap"
        };

        this.__placementTool = "multilayerPositionTool";

        this.__toolParams = {
            position: "position"
        };

        this.__renderKeys = ["FLOW", "CONTROL", "INVERSE"];

        this.__mint = "PUMP3D";

        this.__zOffsetKeys = {
            FLOW: "height",
            CONTROL: "height",
            INVERSE: "height"
        };

        this.__substrateOffset = {
            FLOW: "0",
            CONTROL: "+1",
            INVERSE: "0"
        };
    }

    getPorts(params: { [k: string]: any }) {
        const radius = params.valveRadius;
        const spacing = params.spacing;

        const ports = [];

        ports.push(new ComponentPort(0, -spacing - radius, "1", LogicalLayerType.FLOW));
        ports.push(new ComponentPort(0, spacing + radius, "2", LogicalLayerType.FLOW));

        ports.push(new ComponentPort(0, -spacing, "3", LogicalLayerType.CONTROL));

        ports.push(new ComponentPort(0, 0, "4", LogicalLayerType.CONTROL));

        ports.push(new ComponentPort(0, spacing, "5", LogicalLayerType.CONTROL));
        return ports;
    }

    render2D(params: { [k: string]: any }, key = "FLOW") {
        if (key === "FLOW") {
            return this.__drawFlow(params);
        } else if (key === "CONTROL") {
            return this.__drawControl(params);
        } else if (key === "INVERSE") {
            return this.__drawInverse(params);
        }
        throw new Error("Unknown key: " + key);

    }

    render2DTarget(key: string, params: { [k: string]: any }) {
        const ret = new paper.CompoundPath("");
        const flow = this.render2D(params, "FLOW");
        const control = this.render2D(params, "CONTROL");
        ret.addChild(control as paper.Item);
        ret.addChild(flow as paper.Item);
        ret.fillColor = params.color;
        ret.fillColor!.alpha = 0.5;
        return ret;
    }

    __drawFlow(params: { [k: string]: any }) {
        let valve;
        let cutout;
        let circ;
        let center;
        const ret = new paper.CompoundPath("");

        const position = params.position;
        const gap = params.gap;
        const radius = params.valveRadius;
        const color = params.color;
        const rotation = params.rotation;
        const spacing = params.spacing;
        const channelwidth = params.flowChannelWidth;

        center = new paper.Point(position[0], position[1]);
        // let h0p0, h0p1, h0p2, h1p0, h1p1, h1p2;
        circ = new paper.Path.Circle(center, radius);
        // circ.fillColor = color;
        //   if (String(color) === "3F51B5") {
        cutout = new paper.Path.Rectangle({
            from: new paper.Point(position[0] - radius, position[1] - gap / 2),
            to: new paper.Point(position[0] + radius, position[1] + gap / 2)
        });
        // cutout.fillColor = "white";
        valve = circ.subtract(cutout);
        ret.addChild(valve);

        const bottomcenter = new paper.Point(position[0], position[1] + spacing);
        circ = new paper.Path.Circle(bottomcenter, radius);
        // circ.fillColor = color;
        //   if (String(color) === "3F51B5") {
        cutout = new paper.Path.Rectangle({
            from: new paper.Point(bottomcenter.x - radius, bottomcenter.y - gap / 2),
            to: new paper.Point(bottomcenter.x + radius, bottomcenter.y + gap / 2)
        });
        // cutout.fillColor = "white";
        valve = circ.subtract(cutout);
        ret.addChild(valve);

        const topcenter = new paper.Point(position[0], position[1] - spacing);

        circ = new paper.Path.Circle(topcenter, radius);
        // circ.fillColor = color;
        //   if (String(color) === "3F51B5") {
        cutout = new paper.Path.Rectangle({
            from: new paper.Point(topcenter.x - radius, topcenter.y - gap / 2),
            to: new paper.Point(topcenter.x + radius, topcenter.y + gap / 2)
        });
        // cutout.fillColor = "white";
        valve = circ.subtract(cutout);
        ret.addChild(valve);

        // Create the channels that go through
        const bottomchannel = new paper.Path.Rectangle({
            from: new paper.Point(bottomcenter.x - channelwidth / 2, bottomcenter.y - gap / 2),
            to: new paper.Point(center.x + channelwidth / 2, center.y + gap / 2)
        });

        ret.addChild(bottomchannel);

        const topchannel = new paper.Path.Rectangle({
            from: new paper.Point(topcenter.x - channelwidth / 2, topcenter.y + gap / 2),
            to: new paper.Point(center.x + channelwidth / 2, center.y - gap / 2)
        });

        ret.addChild(topchannel);

        ret.rotate(rotation, center);
        ret.fillColor = color;

        return ret;
    }

    __drawControl(params: { [k: string]: any }) {
        let circ;
        const position = params.position;
        const radius = params.valveRadius;
        const color = params.color;
        const rotation = params.rotation;
        const spacing = params.spacing;

        const ret = new paper.CompoundPath("");

        const center = new paper.Point(position[0], position[1]);

        circ = new paper.Path.Circle(center, radius);
        ret.addChild(circ);

        const topcenter = new paper.Point(position[0], position[1] - spacing);
        circ = new paper.Path.Circle(topcenter, radius);
        ret.addChild(circ);

        const bottomcenter = new paper.Point(position[0], position[1] + spacing);
        circ = new paper.Path.Circle(bottomcenter, radius);
        ret.addChild(circ);

        ret.rotate(rotation, center);
        ret.fillColor = color;
        return ret;
    }

    __drawInverse(params: { [k: string]: any }) {
        let circ;
        const position = params.position;
        const radius = params.valveRadius;
        const color = params.color;
        const rotation = params.rotation;
        const spacing = params.spacing;

        const ret = new paper.CompoundPath("");

        const center = new paper.Point(position[0], position[1]);

        circ = new paper.Path.Circle(center, radius);
        ret.addChild(circ);

        const topcenter = new paper.Point(position[0], position[1] - spacing);
        circ = new paper.Path.Circle(topcenter, radius);
        ret.addChild(circ);

        const bottomcenter = new paper.Point(position[0], position[1] + spacing);
        circ = new paper.Path.Circle(bottomcenter, radius);
        ret.addChild(circ);

        ret.rotate(rotation, center);
        ret.fillColor = color;
        return ret;
    }
}
