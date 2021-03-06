import Template from "./template";
import paper from "paper";
import ComponentPort from "../core/componentPort";
import { LogicalLayerType } from "../core/init";

export default class Sorter extends Template {
    constructor() {
        super();
    }

    __setupDefinitions() {
        this.__unique = {
            position: "Point"
        };

        this.__heritable = {
            componentSpacing: "Float",
            rotation: "Float",
            height: "Float",
            inletWidth: "Float",
            inletLength: "Float",
            electrodeDistance: "Float",
            electrodeWidth: "Float",
            electrodeLength: "Float",
            outletWidth: "Float",
            angle: "Float",
            wasteWidth: "Float",
            outputLength: "Float",
            keepWidth: "Float",
            pressureWidth: "Float",
            pressureSpacing: "Float",
            numberofDistributors: "Float",
            channelDepth: "Float",
            electrodeDepth: "Float",
            pressureDepth: "Float"
        };

        this.__defaults = {
            componentSpacing: 1000,
            rotation: 0,
            height: 250,
            inletWidth: 0.8 * 1000,
            inletLength: 4 * 1000,
            electrodeDistance: 1 * 1000,
            electrodeWidth: 0.7 * 1000,
            electrodeLength: 5 * 1000,
            outletWidth: 0.8 * 1000,
            angle: 45,
            wasteWidth: 1.2 * 1000,
            outputLength: 4 * 1000,
            keepWidth: 2 * 1000,
            pressureWidth: 0.4 * 1000,
            pressureSpacing: 1.5 * 1000,
            numberofDistributors: 5,
            channelDepth: 1000,
            electrodeDepth: 1000,
            pressureDepth: 1000
        };

        this.__units = {
            componentSpacing: "μm",
            rotation: "°",
            height: "μm",
            inletWidth: "μm",
            inletLength: "μm",
            electrodeDistance: "μm",
            electrodeWidth: "μm",
            electrodeLength: "μm",
            outletWidth: "μm",
            angle: "°",
            wasteWidth: "μm",
            outputLength: "μm",
            keepWidth: "μm",
            pressureWidth: "μm",
            pressureSpacing: "μm",
            numberofDistributors: "μm",
            channelDepth: "μm",
            electrodeDepth: "μm",
            pressureDepth: "μm"
        };

        this.__minimum = {
            componentSpacing: 0,
            rotation: 0,
            height: 10,
            inletWidth: 0.5 * 1000,
            inletLength: 2 * 1000,
            electrodeDistance: 0.5 * 1000,
            electrodeWidth: 0.5 * 1000,
            electrodeLength: 2.5 * 1000,
            outletWidth: 0.5 * 1000,
            angle: 0,
            wasteWidth: 0.5 * 1000,
            outputLength: 2 * 1000,
            keepWidth: 2 * 1000,
            pressureWidth: 0.2 * 1000,
            pressureSpacing: 0.5 * 1000,
            numberofDistributors: 1,
            channelDepth: 1000,
            electrodeDepth: 1000,
            pressureDepth: 1000
        };

        this.__maximum = {
            componentSpacing: 10000,
            rotation: 360,
            height: 1200,
            inletWidth: 2 * 1000,
            inletLength: 6 * 1000,
            electrodeDistance: 1.5 * 1000,
            electrodeWidth: 1.5 * 1000,
            electrodeLength: 7.5 * 1000,
            outletWidth: 2 * 1000,
            angle: 180,
            wasteWidth: 1.5 * 1000,
            outputLength: 6 * 1000,
            keepWidth: 3.5 * 1000,
            pressureWidth: 1 * 1000,
            pressureSpacing: 2 * 1000,
            numberofDistributors: 10,
            channelDepth: 1000,
            electrodeDepth: 1000,
            pressureDepth: 1000
        };

        this.__placementTool = "multilayerPositionTool";

        this.__toolParams = {
            cursorPosition: "position"
        };

        this.__featureParams = {
            componentSpacing: "componentSpacing",
            position: "position",
            rotation: "rotation",
            inletWidth: "inletWidth",
            inletLength: "inletLength",
            electrodeDistance: "electrodeDistance",
            electrodeWidth: "electrodeWidth",
            electrodeLength: "electrodeLength",
            outletWidth: "outletWidth",
            angle: "angle",
            wasteWidth: "wasteWidth",
            outputLength: "outputLength",
            keepWidth: "keepWidth",
            pressureWidth: "pressureWidth",
            pressureSpacing: "pressureSpacing",
            numberofDistributors: "numberofDistributors",
            channelDepth: "channelDepth",
            electrodeDepth: "electrodeDepth",
            pressureDepth: "pressureDepth"
        };

        this.__targetParams = {
            componentSpacing: "componentSpacing",
            rotation: "rotation",
            inletWidth: "inletWidth",
            inletLength: "inletLength",
            electrodeDistance: "electrodeDistance",
            electrodeWidth: "electrodeWidth",
            electrodeLength: "electrodeLength",
            outletWidth: "outletWidth",
            angle: "angle",
            wasteWidth: "wasteWidth",
            outputLength: "outputLength",
            keepWidth: "keepWidth",
            pressureWidth: "pressureWidth",
            pressureSpacing: "pressureSpacing",
            numberofDistributors: "numberofDistributors",
            channelDepth: "channelDepth",
            electrodeDepth: "electrodeDepth",
            pressureDepth: "pressureDepth"
        };

        this.__renderKeys = ["FLOW", "INTEGRATION"];

        this.__mint = "DROPLET SORTER";

        this.__zOffsetKeys = {
            FLOW: "height",
            INTEGRATION: "electrodeDepth"
        };

        this.__substrateOffset = {
            FLOW: "0",
            INTEGRATION: "0"
        };
    }

    getPorts(params: { [k: string]: any }) {
        const inletLength = params.inletLength;
        const angle = params.angle;
        const outputLength = params.outputLength;
        const pressureWidth = params.pressureWidth;
        const pressureSpacing = params.pressureSpacing;
        const numberofDistributors = params.numberofDistributors;

        const outletLen = ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth)) / Math.cos(((angle / 2) * Math.PI) / 180);

        const ports = [];

        ports.push(new ComponentPort(-inletLength, 0, "1", LogicalLayerType.FLOW));

        ports.push(
            new ComponentPort(
                outletLen * Math.cos(((angle / 2) * Math.PI) / 180) + outputLength,
                -((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth) - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180),
                "2",
                LogicalLayerType.FLOW
            )
        );

        ports.push(
            new ComponentPort(
                outletLen * Math.cos(((angle / 2) * Math.PI) / 180) + outputLength,
                ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth) - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180),
                "3",
                LogicalLayerType.FLOW
            )
        );

        return ports;
    }

    __renderFlow(params: { [k: string]: any }) {
        const rotation = params.rotation;
        const x = params.position[0];
        const y = params.position[1];
        const color = params.color;
        const inletWidth = params.inletWidth;
        const inletLength = params.inletLength;
        const outletWidth = params.outletWidth;
        const angle = params.angle;
        const wasteWidth = params.wasteWidth;
        const outputLength = params.outputLength;
        const keepWidth = params.keepWidth;
        const pressureWidth = params.pressureWidth;
        const pressureSpacing = params.pressureSpacing;
        const numberofDistributors = params.numberofDistributors;
        const serp = new paper.CompoundPath("");

        // pressure distributors
        for (let i = 0; i < numberofDistributors; i++) {
            const newRightX = (i + 1.5) * (pressureSpacing + pressureWidth);

            const newLeftX = newRightX - pressureWidth;

            const pHeight = (newRightX - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180);
            // upper
            let topLeft = new paper.Point(x + newLeftX, y - pHeight);
            let bottomRight = new paper.Point(x + newRightX, y);
            serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

            // lower
            topLeft = new paper.Point(x + newLeftX, y + pHeight);
            bottomRight = new paper.Point(x + newRightX, y);
            serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));
        }

        const outletLen = ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth)) / Math.cos(((angle / 2) * Math.PI) / 180);
        let topLeft = new paper.Point(x, y - outletWidth / 2);
        let bottomRight = new paper.Point(x + outletLen, y + outletWidth / 2);

        // upper outlet
        let outlet = new paper.Path.Rectangle(topLeft, bottomRight);
        outlet.rotate(-angle / 2, new paper.Point(x, y));
        serp.addChild(outlet);

        // lower outlet
        outlet = new paper.Path.Rectangle(topLeft, bottomRight);
        outlet.rotate(angle / 2, new paper.Point(x, y));
        serp.addChild(outlet);

        // inlet
        topLeft = new paper.Point(x - inletLength, y - inletWidth / 2);
        bottomRight = new paper.Point(x, y + inletWidth / 2);

        serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        // waste
        topLeft = new paper.Point(
            x + outletLen * Math.cos(((angle / 2) * Math.PI) / 180),
            y - ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth) - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180) - wasteWidth / 2
        );
        bottomRight = new paper.Point(
            x + outletLen * Math.cos(((angle / 2) * Math.PI) / 180) + outputLength,
            y - ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth) - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180) + wasteWidth / 2
        );

        serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        // keep
        topLeft = new paper.Point(
            x + outletLen * Math.cos(((angle / 2) * Math.PI) / 180),
            y + ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth) - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180) - keepWidth / 2
        );
        bottomRight = new paper.Point(
            x + outletLen * Math.cos(((angle / 2) * Math.PI) / 180) + outputLength,
            y + ((numberofDistributors + 0.5) * (pressureSpacing + pressureWidth) - pressureWidth / 2) * Math.tan(((angle / 2) * Math.PI) / 180) + keepWidth / 2
        );

        serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        serp.rotate(rotation, new paper.Point(x, y));

        serp.fillColor = color;
        return serp;
    }

    __renderIntegrate(params: { [k: string]: any }) {
        const rotation = params.rotation;
        const x = params.position[0];
        const y = params.position[1];
        const color = params.color;
        const electrodeDistance = params.electrodeDistance;
        const electrodeWidth = params.electrodeWidth;
        const electrodeLength = params.electrodeLength;
        const angle = params.angle;
        const serp = new paper.CompoundPath("");

        // middle electrode
        let topLeft = new paper.Point(x - electrodeWidth / 2, y + electrodeDistance);
        let bottomRight = new paper.Point(x + electrodeWidth / 2, y + electrodeDistance + electrodeLength);

        serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        // left electrode
        topLeft = new paper.Point(x - electrodeWidth / 2 - 2 * electrodeWidth, y + electrodeDistance);
        bottomRight = new paper.Point(x + electrodeWidth / 2 - 2 * electrodeWidth, y + electrodeDistance + electrodeLength);

        serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        // right electrode
        topLeft = new paper.Point(x - electrodeWidth / 2 + 2 * electrodeWidth, y + electrodeDistance + 2 * electrodeWidth * Math.tan(((angle / 2) * Math.PI) / 180));
        bottomRight = new paper.Point(
            x + electrodeWidth / 2 + 2 * electrodeWidth,
            y + electrodeDistance + 2 * electrodeWidth * Math.tan(((angle / 2) * Math.PI) / 180) + electrodeLength
        );

        serp.addChild(new paper.Path.Rectangle(topLeft, bottomRight));

        serp.rotate(rotation, new paper.Point(x, y));

        serp.fillColor = color;
        return serp;
    }

    // render2DTarget(key, params) {
    //     const serp = this.render2D(params, key);

    //     serp.fillColor.alpha = 0.5;
    //     return serp;
    // }

    render2D(params: { [k: string]: any }, key = "FLOW") {
        if (key === "FLOW") {
            return this.__renderFlow(params);
        } else if (key === "INTEGRATION") {
            return this.__renderIntegrate(params);
        }
        throw new Error("Unknown render key found in DROPLET SORTER: " + key);
    }

    render2DTarget(key: string, params: { [k: string]: any }) {
        const ret = new paper.CompoundPath("");
        const flow = this.render2D(params, "FLOW");
        const integrate = this.render2D(params, "INTEGRATION");
        ret.addChild(integrate);
        ret.addChild(flow);
        ret.fillColor = params.color;
        ret.fillColor!.alpha = 0.5;
        return ret;
    }
}
