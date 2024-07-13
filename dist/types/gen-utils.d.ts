/**
 * PptxGenJS: Utility Methods
 */
import { SCHEME_COLORS, SHAPE_NAME } from './core-enums';
import { PresLayout, TextGlowProps, PresSlide, Color, Coord, ShadowProps, ColorSelection, ColorConfig, GradFillColor, SolidFillColor, BlipFillColor, ShapeLineProps, ShapePath, SlideLayout } from './core-interfaces';
/**
 * Translates any type of `x`/`y`/`w`/`h` prop to EMU 这里不在兼容 emu单位 全面使用英寸单位
 * - guaranteed to return a result regardless of undefined, null, etc. (0)
 * - {number} - 0.5 (inches)
 * - {string} - "75%"
 * @param {number|string} size - numeric ("5.5") or percentage ("90%")
 * @param {'X' | 'Y'} xyDir - direction
 * @param {PresLayout} layout - presentation layout
 * @returns {number} calculated size
 */
export declare function getSmartParseNumber(size: number): number;
export declare function getSmartParseNumber(size: Coord, xyDir: 'X' | 'Y', layout: PresLayout): number;
/**
 * Basic UUID Generator Adapted
 * @link https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
 * @param {string} uuidFormat - UUID format
 * @returns {string} UUID
 */
export declare function getUuid(uuidFormat: string): string;
/**
 * 是否是空值
 * @param value 值
 * @returns 是否是空值
 */
export declare function isNil(value: any): value is null | undefined;
/**
 * Replace special XML characters with HTML-encoded strings
 * @param {string} xml - XML string to encode
 * @returns {string} escaped XML
 */
export declare function encodeXmlEntities(xml: string): string;
/**
 * Convert inches into EMU 这里不在兼容 emu单位 全面使用英寸单位
 * @param {number|string} inches - as string or number
 * @returns {number} EMU value
 */
export declare function inch2Emu(inches: number | string): number;
/**
 *  Convert `pt` into points (using `ONEPT`)
 * @param {number|string} pt
 * @returns {number} value in points (`ONEPT`)
 */
export declare function valToPts(pt: number | string): number;
/**
 * Convert degrees (0..360) to PowerPoint `rot` value
 * @param {number} d degrees
 * @returns {number} calculated `rot` value
 */
export declare function convertRotationDegrees(d: number): number;
/**
 * Converts component value to hex value
 * @param {number} c - component color
 * @returns {string} hex string
 */
export declare function componentToHex(c: number): string;
/**
 * Converts RGB colors from css selectors to Hex for Presentation colors
 * @param {number} r - red value
 * @param {number} g - green value
 * @param {number} b - blue value
 * @returns {string} XML string
 */
export declare function rgbToHex(r: number, g: number, b: number): string;
/**
 * 获取URL的文件类型
 * @param url url链接
 * @param defaultType 默认类型
 * @returns  文件类型
 */
export declare function getURLType(url: string, defaultType?: string): string;
/**
 * 获取base64的文件类型
 * @param base64 base64字符串
 * @param defaultType 默认类型
 * @returns 文件类型
 */
export declare function getBase64Type(base64: string, defaultType?: string): string;
/**  TODO: FUTURE: TODO-4.0:
 * @date 2022-04-10
 * @tldr this s/b a private method with all current calls switched to `genXmlColorSelection()`
 * @desc lots of code calls this method
 * @example [gen-charts.tx] `strXml += '<a:solidFill>' + createColorElement(seriesColor, `<a:alpha val="${Math.round(opts.chartColorsOpacity * 1000)}"/>`) + '</a:solidFill>'`
 * Thi sis wrong. We s/b calling `genXmlColorSelection()` instead as it returns `<a:solidfill>BLAH</a:solidFill>`!!
 */
/**
 * Create either a `a:schemeClr` - (scheme color) or `a:srgbClr` (hexa representation).
 * @param {string|SCHEME_COLORS} colorStr - hexa representation (eg. "FFFF00") or a scheme color constant (eg. pptx.SchemeColor.ACCENT1)
 * @param {string} innerElements - additional elements that adjust the color and are enclosed by the color element
 * @returns {string} XML string
 */
export declare function createColorElement(colorStr: string | SCHEME_COLORS, innerElements?: string): string;
/**
 * Creates `a:glow` element
 * @param {TextGlowProps} options glow properties
 * @param {TextGlowProps} defaults defaults for unspecified properties in `opts`
 * @see http://officeopenxml.com/drwSp-effects.php
 * { size: 8, color: 'FFFFFF', opacity: 0.75 };
 */
export declare function createGlowElement(options: TextGlowProps, defaults: TextGlowProps): string;
/**
 * 获取颜色配置项元素
 * @param {ColorConfig} colorConfig
 * @returns {string} elements XML
 */
export declare function createColorConfigElement(colorConfig?: ColorConfig): string;
/**
 * 创建实色填充
 * @param {SolidFillColor} options 实色填充参数
 */
export declare function createSolidFillElement(options: SolidFillColor): string;
/**
 * 创建渐变填充
 * @param {GradFillColor} options 渐变填充参数
 */
export declare function createGradFillElement(options: GradFillColor): string;
export declare function createBlipFillElement(options: BlipFillColor): string;
/**
 * Create color selection
 * @param {Color | ColorSelection} props fill props
 * @returns XML string
 */
export declare function genXmlColorSelection(props: Color): string;
export declare function genXmlColorSelection(props: ColorSelection): string;
/**
 * 初始化颜色选择 现阶段只有grad和blip需要初始化 为了方便统一处理 其他类型还是统一加入
 * @param {ColorSelection} options  颜色选择
 * @param {PresSlide} target 幻灯片 用于blip填充时需要传入
 * @returns {ColorSelection} 颜色选择
 */
export declare function initColorSelection(options: ColorSelection, target?: PresSlide): ColorSelection;
/**
 * 生成线条元素
 * @param {ShapeLineProps} line  线条参数
 * @returns {string}  线条元素
 */
export declare function genLineElementXML(line: ShapeLineProps): string;
/**
 * 生成几何形状元素
 * @param {SHAPE_NAME} name 几何形状名称
 * @param {Record<string, number>} options.path 几何形状路径
 * @param {ShapePath} options.adjusting 调整参数
 * @returns {string} 几何形状元素
 */
interface GeometryElementXMLOptions {
    adjusting?: Record<string, number>;
    paths?: ShapePath[];
    slide?: PresSlide | SlideLayout;
}
export declare function genGeometryElementXML(name?: SHAPE_NAME, { adjusting, paths, slide }?: GeometryElementXMLOptions): string;
/**
 * Get a new rel ID (rId) for charts, media, etc.
 * @param {PresSlide} target - the slide to use
 * @returns {number} count of all current rels plus 1 for the caller to use as its "rId"
 */
export declare function getNewRelId(target: PresSlide): number;
/**
 * Checks shadow options passed by user and performs corrections if needed.
 * @param {ShadowProps} ShadowProps - shadow options
 */
export declare function correctShadowOptions(ShadowProps: ShadowProps): ShadowProps | undefined;
export {};
