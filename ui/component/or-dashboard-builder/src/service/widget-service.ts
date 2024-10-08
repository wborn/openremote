import {DashboardWidget} from "@openremote/model";
import {widgetTypes} from "../index";
import {WidgetConfig} from "../util/widget-config";
import {Util} from "@openremote/core";
import {WidgetManifest} from "../util/or-widget";

export class WidgetService {

    public static getManifest(widgetTypeId: string) {
        const manifest = widgetTypes.get(widgetTypeId);
        if(!manifest) {
            throw new Error("Widget manifest could not be found during widget creation.");
        }
        return manifest;
    }

    public static async placeNew(widgetTypeId: string, x: number, y: number): Promise<DashboardWidget> {
        const randomId = (Math.random() + 1).toString(36).substring(2);
        const manifest = this.getManifest(widgetTypeId);
        const widget = {
            id: randomId,
            displayName: manifest.displayName,
            gridItem: {
                id: randomId,
                x: x,
                y: y,
                w: 2,
                h: 2,
                minW: manifest.minColumnWidth,
                minH: manifest.minColumnHeight,
                minPixelW: manifest.minPixelWidth,
                minPixelH: manifest.minPixelHeight,
                noResize: false,
                noMove: false,
                locked: false,
            }, // Left empty until it is generated by or-dashboard-preview
            widgetConfig: manifest.getDefaultConfig(),
            widgetTypeId: widgetTypeId
        } as DashboardWidget;
        return widget;
    }

    // Method used to correct the OrWidgetConfig specification
    // So, if certain fields are removed or invalid, it will be corrected by merging the object with the default OrWidgetConfig.
    // Will only return a different object if it actually changes. This prevents child objects being returned in a different order.
    public static correctToConfigSpec(manifest: WidgetManifest, widgetConfig: WidgetConfig) {
        const newConfig = Util.mergeObjects(manifest.getDefaultConfig(), widgetConfig, false) as WidgetConfig;
        if(Util.objectsEqual(newConfig, widgetConfig)) {
            return widgetConfig;
        } else {
            return newConfig;
        }
    }
}
