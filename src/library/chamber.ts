import Template from "./template";
import paper from "paper";
import ComponentPort from "../core/componentPort";
import { LogicalLayerType  } from "../core/init";

export default class Chamber extends Template {
    constructor() {
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            position: "Point"
        };

        this.__heritable = {
            componentSpacing: "Float",
            width: "Float",
            length: "Float",
            height: "Float",
            cornerRadius: "Float",
            rotation: "Float"
        };

        this.__defaults = {
            componentSpacing: 1000,
            width: 5000,
            length: 5000,
            height: 250,
            cornerRadius: 200,
            rotation: 0
        };

        this.__units = {
            componentSpacing: "μm",
            width: "μm",
            length: "μm",
            height: "μm",
            cornerRadius: "μm",
            rotation: "°"
        };

        this.__minimum = {
            componentSpacing: 0,
            width: 5,
            length: 5,
            height: 1,
            cornerRadius: 1,
            rotation: 0
        };

        this.__maximum = {
            componentSpacing: 10000,
            width: 50000,
            length: 50000,
            height: 50000,
            cornerRadius: 1000,
            rotation: 360
        };

        this.__featureParams = {
            componentSpacing: "componentSpacing",
            position: "position",
            width: "width",
            length: "length",
            height: "height",
            cornerRadius: "cornerRadius",
            rotation: "rotation"
        };

        this.__targetParams = {
            componentSpacing: "componentSpacing",
            position: "position",
            width: "width",
            length: "length",
            height: "height",
            cornerRadius: "cornerRadius",
            rotation: "rotation"
        };

        this.__placementTool = "componentPositionTool";

        this.__toolParams = {
            position: "position"
        };

        this.__renderKeys = ["FLOW"];

        this.__mint = "REACTION CHAMBER";

        this.__zOffsetKeys = {
            FLOW: "height"
        };

        this.__substrateOffset = {
            FLOW: "0"
        };
    }

    getPorts(params: { [k: string]: any }) {
        const l = params.length;
        const w = params.width;

        const ports = [];

        ports.push(new ComponentPort(0, -l / 2, "1", LogicalLayerType.FLOW));

        ports.push(new ComponentPort(w / 2, 0, "2", LogicalLayerType.FLOW));

        ports.push(new ComponentPort(0, l / 2, "3", LogicalLayerType.FLOW));

        ports.push(new ComponentPort(-w / 2, 0, "4", LogicalLayerType.FLOW));

        return ports;
    }

    render2D(params: { [k: string]: any }, key: string) {
        const position = params.position;
        const px = position[0];
        const py = position[1];
        const l = params.length;
        const w = params.width;
        const rotation = params.rotation;
        const color = params.color;
        const radius = params.cornerRadius;

        const rendered = new paper.CompoundPath("");

        const rec = new paper.Path.Rectangle({
            point: new paper.Point(px - w / 2, py - l / 2),
            size: [w, l],
            radius: radius
        });

        rendered.addChild(rec);

        rendered.fillColor = color;
        rendered.rotate(rotation, new paper.Point(px, py));
        return rendered;
    }

    render2DTarget(key: string, params: { [k: string]: any }) {
        const render = this.render2D(params, key);
        render.fillColor!.alpha = 0.5;
        return render;
    }
}
