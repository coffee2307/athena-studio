import type {Metadata} from "next";
import {Site} from "@/templates/hospitality-booking/src/components/Site";
export const metadata:Metadata={title:"Đặt bàn | Bếp & Chuyện — Athena Studio Demo",robots:{index:false,follow:false}};
export default function BookingDemoPage(){return <Site section="booking" basePath="/template-demos/hospitality-booking" assetBase="/sovereign/hospitality-booking"/>;}
