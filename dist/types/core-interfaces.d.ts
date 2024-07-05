/**
 * PptxGenJS Interfaces
 */
import { CHART_NAME, CLR_SCHEME_COLOR, ElementType, PLACEHOLDER_TYPE, SHAPE_NAME, SLIDE_OBJECT_TYPES, TEXT_HALIGN, TEXT_VALIGN, WRITE_OUTPUT_TYPE } from './core-enums';
/**
 * Coordinate number - either:
 * - Inches (0-n)
 * - Percentage (0-100)
 *
 * @example 10.25 // coordinate in inches
 * @example '75%' // coordinate as percentage of slide size
 */
export type Coord = number | `${number}%`;
export interface PositionProps {
    /**
     * Horizontal position
     * - inches or percentage
     * @example 10.25 // position in inches
     * @example '75%' // position as percentage of slide size
     */
    x?: Coord;
    /**
     * Vertical position
     * - inches or percentage
     * @example 10.25 // position in inches
     * @example '75%' // position as percentage of slide size
     */
    y?: Coord;
    /**
     * Height
     * - inches or percentage
     * @example 10.25 // height in inches
     * @example '75%' // height as percentage of slide size
     */
    h?: Coord;
    /**
     * Width
     * - inches or percentage
     * @example 10.25 // width in inches
     * @example '75%' // width as percentage of slide size
     */
    w?: Coord;
}
/**
 * Either `data` or `path` is required
 */
export interface DataOrPathProps {
    /**
     * URL or relative path
     *
     * @example 'https://onedrives.com/myimg.png` // retrieve image via URL
     * @example '/home/gitbrent/images/myimg.png` // retrieve image via local path
     */
    path?: string;
    /**
     * base64-encoded string
     * - Useful for avoiding potential path/server issues
     *
     * @example 'image/png;base64,iVtDafDrBF[...]=' // pre-encoded image in base-64
     */
    data?: string;
}
export interface BackgroundProps extends DataOrPathProps {
    /**
     * 填充方式
     */
    fill?: ColorSelection;
    /**
     * source URL
     * @deprecated v3.6.0 - use `DataOrPathProps` instead - remove in v4.0.0
     */
    src?: string;
}
/**
 * Color in Hex format
 * @example 'FF3399'
 */
export type HexColor = string;
export type ThemeColor = 'tx1' | 'tx2' | 'bg1' | 'bg2' | 'accent1' | 'accent2' | 'accent3' | 'accent4' | 'accent5' | 'accent6';
export type Color = HexColor | ThemeColor;
export type Margin = number | [number, number, number, number];
export type HAlign = 'left' | 'center' | 'right' | 'justify';
export type VAlign = 'top' | 'middle' | 'bottom';
export interface ColorConfig {
    /**
     * 下面是颜色配置项
     *  范围 0-100
     */
    alpha?: number;
    hueMod?: number;
    lumMod?: number;
    lumOff?: number;
    satMod?: number;
    satOff?: number;
    shade?: number;
    tint?: number;
}
export interface FillColor {
    /**
     * Fill color
     * - `HexColor` or `ThemeColor`
     * @example 'FF0000' // hex color (red)
     * @example pptx.SchemeColor.text1 // Theme color (Text1)
     */
    color?: Color;
    /**
     *  颜色配置项 取值范围 0-100
     * @example { alpha: 50, hueMod: 50, lumMod: 50, lumOff: 50, satMod: 50, satOff: 50, shade: 50, tint: 50 }
     */
    colorConfig?: ColorConfig;
}
export interface NoneFillColor {
    type: 'none';
}
export interface SolidFillColor extends FillColor {
    type: 'solid';
}
export interface GradFillColor {
    type: 'grad';
    gradientStopList?: {
        pos: number;
        color: FillColor;
    }[];
    rotWithShape?: boolean;
    flip?: 'x' | 'y' | 'xy';
    gradientType?: 'radial' | 'linear';
    gradientProps?: {
        rot?: number;
        left?: number;
        right?: number;
        bottom?: number;
        top?: number;
    };
}
export interface BlipFillColor extends DataOrPathProps {
    _rid: number;
    type: 'blip';
    rotWithShape?: boolean;
    alpha?: number;
    tiling?: 'tile' | 'stretch';
    tileProps?: {
        tx?: number;
        ty?: number;
        sx?: number;
        sy?: number;
        flip?: string;
        algn?: string;
    };
    stretchProps?: {
        left?: number;
        right?: number;
        bottom?: number;
        top?: number;
    };
}
export type ColorSelection = NoneFillColor | SolidFillColor | GradFillColor | BlipFillColor;
export interface BorderProps {
    /**
     * Border type
     * @default solid
     */
    type?: 'none' | 'dash' | 'solid';
    /**
     * Border color (hex)
     * @example 'FF3399'
     * @default '666666'
     */
    color?: HexColor;
    /**
     * Border size (points)
     * @default 1
     */
    pt?: number;
}
export interface HyperlinkProps {
    _rId: number;
    /**
     * Slide number to link to
     */
    slide?: number;
    /**
     * Url to link to
     */
    url?: string;
    /**
     * Hyperlink Tooltip
     */
    tooltip?: string;
}
export interface ShadowProps {
    /**
     * shadow type
     * @default 'none'
     */
    type: 'outer' | 'inner' | 'none';
    /**
     * opacity (percent)
     * - range: 0.0-1.0
     * @example 0.5 // 50% opaque
     */
    opacity?: number;
    /**
     * blur (points)
     * - range: 0-100
     * @default 0
     */
    blur?: number;
    /**
     * angle (degrees)
     * - range: 0-359
     * @default 0
     */
    angle?: number;
    /**
     * shadow offset (points)
     * - range: 0-200
     * @default 0
     */
    offset?: number;
    /**
     * shadow color (hex format)
     * @example 'FF3399'
     */
    color?: HexColor;
    /**
     * whether to rotate shadow with shape
     * @default false
     */
    rotateWithShape?: boolean;
}
export interface ShapeLineProps {
    /**
     * 字体颜色
     */
    color?: ColorSelection;
    /**
     * Line width (pt)
     * @default 1
     */
    width?: number;
    /**
     * Dash type
     * @default 'solid'
     */
    dashType?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot';
    /**
     * Begin arrow type
     * @since v3.3.0
     */
    beginArrowType?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle';
    /**
     * End arrow type
     * @since v3.3.0
     */
    endArrowType?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle';
    capType?: string;
    joinType?: string;
    /**
     * Dash type
     * @deprecated v3.3.0 - use `dashType`
     */
    lineDash?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot';
    /**
     * @deprecated v3.3.0 - use `beginArrowType`
     */
    lineHead?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle';
    /**
     * @deprecated v3.3.0 - use `endArrowType`
     */
    lineTail?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle';
    /**
     * Line width (pt)
     * @deprecated v3.3.0 - use `width`
     */
    pt?: number;
    /**
     * Line size (pt)
     * @deprecated v3.3.0 - use `width`
     */
    size?: number;
}
export interface TextBaseProps {
    /**
     * 字体颜色
     */
    fontColor?: ColorSelection;
    /**
     * Horizontal alignment
     * @default 'left'
     */
    align?: HAlign;
    /**
     * Bold style
     * @default false
     */
    bold?: boolean;
    /**
     * Add a line-break
     * @default false
     */
    breakLine?: boolean;
    /**
     * Add standard or custom bullet
     * - use `true` for standard bullet
     * - pass object options for custom bullet
     * @default false
     */
    bullet?: boolean | {
        /**
         * Bullet type
         * @default bullet
         */
        type?: 'bullet' | 'number';
        /**
         * Bullet character code (unicode)
         * @since v3.3.0
         * @example '25BA' // 'BLACK RIGHT-POINTING POINTER' (U+25BA)
         */
        characterCode?: string;
        /**
         * Indentation (space between bullet and text) (points)
         * @since v3.3.0
         * @default 27 // DEF_BULLET_MARGIN
         * @example 10 // Indents text 10 points from bullet
         */
        indent?: number;
        /**
         * Number type
         * @since v3.3.0
         * @example 'romanLcParenR' // roman numerals lower-case with paranthesis right
         */
        numberType?: 'alphaLcParenBoth' | 'alphaLcParenR' | 'alphaLcPeriod' | 'alphaUcParenBoth' | 'alphaUcParenR' | 'alphaUcPeriod' | 'arabicParenBoth' | 'arabicParenR' | 'arabicPeriod' | 'arabicPlain' | 'romanLcParenBoth' | 'romanLcParenR' | 'romanLcPeriod' | 'romanUcParenBoth' | 'romanUcParenR' | 'romanUcPeriod';
        /**
         * Number bullets start at
         * @since v3.3.0
         * @default 1
         * @example 10 // numbered bullets start with 10
         */
        numberStartAt?: number;
        /**
         * Bullet code (unicode)
         * @deprecated v3.3.0 - use `characterCode`
         */
        code?: string;
        /**
         * Margin between bullet and text
         * @since v3.2.1
         * @deplrecated v3.3.0 - use `indent`
         */
        marginPt?: number;
        /**
         * Number to start with (only applies to type:number)
         * @deprecated v3.3.0 - use `numberStartAt`
         */
        startAt?: number;
        /**
         * Number type
         * @deprecated v3.3.0 - use `numberType`
         */
        style?: string;
    };
    /**
     * Font face name
     * @example 'Arial' // Arial font
     */
    fontFace?: string;
    /**
     * Font size
     * @example 12 // Font size 12
     */
    fontSize?: number;
    /**
     * Text highlight color (hex format)
     * @example 'FFFF00' // yellow
     */
    highlight?: HexColor;
    /**
     * italic style
     * @default false
     */
    italic?: boolean;
    /**
     * language
     * - ISO 639-1 standard language code
     * @default 'en-US' // english US
     * @example 'fr-CA' // french Canadian
     */
    lang?: string;
    /**
     * Add a soft line-break (shift+enter) before line text content
     * @default false
     * @since v3.5.0
     */
    softBreakBefore?: boolean;
    /**
     * tab stops
     * - PowerPoint: Paragraph > Tabs > Tab stop position
     * @example [{ position:1 }, { position:3 }] // Set first tab stop to 1 inch, set second tab stop to 3 inches
     */
    tabStops?: Array<{
        position: number;
        alignment?: 'l' | 'r' | 'ctr' | 'dec';
    }>;
    /**
     * text direction
     * `horz` = horizontal
     * `vert` = rotate 90^
     * `vert270` = rotate 270^
     * `wordArtVert` = stacked
     * @default 'horz'
     */
    textDirection?: 'horz' | 'vert' | 'vert270' | 'wordArtVert';
    /**
     * underline properties
     * - PowerPoint: Font > Color & Underline > Underline Style/Underline Color
     * @default (none)
     */
    underline?: {
        color?: ColorSelection;
        style?: 'dash' | 'dashHeavy' | 'dashLong' | 'dashLongHeavy' | 'dbl' | 'dotDash' | 'dotDashHeave' | 'dotDotDash' | 'dotDotDashHeavy' | 'dotted' | 'dottedHeavy' | 'heavy' | 'none' | 'sng' | 'wavy' | 'wavyDbl' | 'wavyHeavy';
    };
    /**
     * vertical alignment
     * @default 'top'
     */
    valign?: VAlign;
}
export interface PlaceholderProps extends PositionProps, TextBaseProps {
    name: string;
    type: PLACEHOLDER_TYPE;
    /**
     * margin (points)
     */
    margin?: Margin;
}
export interface ObjectNameProps {
    /**
     * Object name
     * - used instead of default "Object N" name
     * - PowerPoint: Home > Arrange > Selection Pane...
     * @since v3.10.0
     * @default 'Object 1'
     * @example 'Antenna Design 9'
     */
    objectName?: string;
}
export interface ThemeProps {
    /**
     * Headings font face name
     * @example 'Arial Narrow'
     * @default 'Calibri Light'
     */
    headFontFace?: string;
    /**
     * Body font face name
     * @example 'Arial'
     * @default 'Calibri'
     */
    bodyFontFace?: string;
    /**
     * 	自定义主题色
     * @example { 'accent1': 'FF0000' }
     * @default {
     *	dk1: '000000',
     *	lt1: 'FFFFFF',
     *	dk2: '44546A',
     *	lt2: 'E7E6E6',
     *	accent1: '4472C4',
     *	accent2: 'ED7D31',
     *	accent3: 'A5A5A5',
     *	accent4: 'FFC000',
     *	accent5: '5B9BD5',
     *	accent6: '70AD47',
     *	hlink: '0563C1',
     *  folHlink: '954F72'
     * }
     */
    clrSchemeColor?: Partial<Record<CLR_SCHEME_COLOR, string>>;
}
export interface GroupProps extends PositionProps, ObjectNameProps {
    /**
     * Flip horizontally?
     * @default false
     */
    flipH?: boolean;
    /**
     * Flip vertical?
     * @default false
     */
    flipV?: boolean;
    /**
     * Image rotation (degrees)
     * - range: -360 to 360
     * @default 0
     * @example 180 // rotate image 180 degrees
     */
    rotate?: number;
}
export type MediaType = 'audio' | 'online' | 'video';
export interface ImageProps extends PositionProps, DataOrPathProps, ObjectNameProps {
    /**
     * Alt Text value ("How would you describe this object and its contents to someone who is blind?")
     * - PowerPoint: [right-click on an image] > "Edit Alt Text..."
     */
    altText?: string;
    /**
     * Flip horizontally?
     * @default false
     */
    flipH?: boolean;
    /**
     * Flip vertical?
     * @default false
     */
    flipV?: boolean;
    hyperlink?: HyperlinkProps;
    /**
     * Placeholder type
     * - values: 'body' | 'header' | 'footer' | 'title' | et. al.
     * @example 'body'
     * @see https://docs.microsoft.com/en-us/office/vba/api/powerpoint.ppplaceholdertype
     */
    placeholder?: string;
    /**
     * Image rotation (degrees)
     * - range: -360 to 360
     * @default 0
     * @example 180 // rotate image 180 degrees
     */
    rotate?: number;
    /**
     * Enable image rounding
     * @default false
     */
    rounding?: boolean;
    /**
     * 形状裁剪
     * @example
     * { name: 'rect', adjusting: { adj1: 10000, adj2: 10000 } }
     */
    clipShape?: {
        /**
         * 形状名称
         * @default 'rect'
         * @example 'rect'
         */
        name?: SHAPE_NAME;
        /**
         * 形状的控制点
         * @example
         *  { adj1: 10000, adj2: 10000 },
         */
        adjusting?: Record<string, number>;
    };
    /**
     * 图片描边
     */
    line?: ShapeLineProps;
    /**
     * Shadow Props
     * - MS-PPT > Format Picture > Shadow
     * @example
     * { type: 'outer', color: '000000', opacity: 0.5, blur: 20,  offset: 20, angle: 270 }
     */
    shadow?: ShadowProps;
    /**
     * Image sizing options
     */
    sizing?: {
        /**
         * Sizing type
         */
        type: 'contain' | 'cover' | 'crop';
        /**
         * Image width
         * - inches or percentage
         * @example 10.25 // position in inches
         * @example '75%' // position as percentage of slide size
         */
        w: Coord;
        /**
         * Image height
         * - inches or percentage
         * @example 10.25 // position in inches
         * @example '75%' // position as percentage of slide size
         */
        h: Coord;
        /**
         * Offset from left to crop image
         * - `crop` only
         * - inches or percentage
         * @example 10.25 // position in inches
         * @example '75%' // position as percentage of slide size
         */
        x?: Coord;
        /**
         * Offset from top to crop image
         * - `crop` only
         * - inches or percentage
         * @example 10.25 // position in inches
         * @example '75%' // position as percentage of slide size
         */
        y?: Coord;
    };
    /**
     * opacity (percent)
     * - MS-PPT > Format Picture > Picture > Picture opacity > opacity
     * - range: 0-100
     * @default 0
     * @example 25 // 25% opacity
     */
    opacity?: number;
}
/**
 * Add media (audio/video) to slide
 * @requires either `link` or `path`
 */
export interface MediaProps extends PositionProps, DataOrPathProps, ObjectNameProps {
    /**
     * Media type
     * - Use 'online' to embed a YouTube video (only supported in recent versions of PowerPoint)
     */
    type: MediaType;
    /**
     * Cover image
     * @since 3.9.0
     * @default "play button" image, gray background
     */
    cover?: string;
    /**
     * media file extension
     * - use when the media file path does not already have an extension, ex: "/folder/SomeSong"
     * @since 3.9.0
     * @default extension from file provided
     */
    extn?: string;
    /**
     * video embed link
     * - works with YouTube
     * - other sites may not show correctly in PowerPoint
     * @example 'https://www.youtube.com/embed/Dph6ynRVyUc' // embed a youtube video
     */
    link?: string;
    /**
     * full or local path
     * @example 'https://freesounds/simpsons/bart.mp3' // embed mp3 audio clip from server
     * @example '/sounds/simpsons_haha.mp3' // embed mp3 audio clip from local directory
     */
    path?: string;
}
export interface ShapeProps extends PositionProps, ObjectNameProps {
    /**
     * Horizontal alignment
     * @default 'left'
     */
    align?: HAlign;
    /**
     * Shape fill color properties
     * @example { color:'FF0000' } // hex color (red)
     * @example { color:'0088CC', colorConfig:{} } // hex color, 50% opacity
     * @example { color:pptx.SchemeColor.accent1 } // Theme color Accent1
     */
    fill?: ColorSelection;
    /**
     * Flip shape horizontally?
     * @default false
     */
    flipH?: boolean;
    /**
     * Flip shape vertical?
     * @default false
     */
    flipV?: boolean;
    /**
     * Add hyperlink to shape
     * @example hyperlink: { url: "https://github.com/gitbrent/pptxgenjs", tooltip: "Visit Homepage" },
     */
    hyperlink?: HyperlinkProps;
    /**
     * Line options
     */
    line?: ShapeLineProps;
    /**
     * Rotation (degrees)
     * - range: -360 to 360
     * @default 0
     * @example 180 // rotate 180 degrees
     */
    rotate?: number;
    /**
     * Shadow options
     * TODO: need new demo.js entry for shape shadow
     */
    shadow?: ShadowProps;
    /**
     * 	形状配置 只有类型是 CUSTOM_GEOMETRY 时才需要这个配置项
     */
    shapePath?: {
        w: number;
        h: number;
        paths: Array<{
            type: 'moveTo';
            x: Coord;
            y: Coord;
        } | {
            type: 'lineTo';
            x: Coord;
            y: Coord;
        } | {
            type: 'cubicBezTo';
            x1: Coord;
            y1: Coord;
            x2: Coord;
            y2: Coord;
            x3: Coord;
            y3: Coord;
        } | {
            type: 'arcTo';
            wR: Coord;
            hR: Coord;
            stAng: number;
            swAng: number;
        } | {
            type: 'quadBezTo';
            x1: Coord;
            y1: Coord;
            x2: Coord;
            y2: Coord;
        } | {
            type: 'close';
        }>;
    };
    /**
     * 形状控制点
     * @example
     *  { adj1: 10000, adj2: 10000 },
     */
    shapeAdjusting?: Record<string, number>;
    /**
     * @deprecated v3.3.0
     */
    lineSize?: number;
    /**
     * @deprecated v3.3.0
     */
    lineDash?: 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'solid' | 'sysDash' | 'sysDot';
    /**
     * @deprecated v3.3.0
     */
    lineHead?: 'arrow' | 'diamond' | 'none' | 'oval' | 'stealth' | 'triangle';
    /**
     * @deprecated v3.3.0
     */
    lineTail?: 'arrow' | 'diamond' | 'none' | 'oval' | 'stealth' | 'triangle';
    /**
     * Shape name (used instead of default "Shape N" name)
     * @deprecated v3.10.0 - use `objectName`
     */
    shapeName?: string;
}
export interface TableToSlidesProps extends TableProps {
    _arrObjTabHeadRows?: TableRow[];
    /**
     * Add an image to slide(s) created during autopaging
     * - `image` prop requires either `path` or `data`
     * - see `DataOrPathProps` for details on `image` props
     * - see `PositionProps` for details on `options` props
     */
    addImage?: {
        image: DataOrPathProps;
        options: PositionProps;
    };
    /**
     * Add a shape to slide(s) created during autopaging
     */
    addShape?: {
        shapeName: SHAPE_NAME;
        options: ShapeProps;
    };
    /**
     * Add a table to slide(s) created during autopaging
     */
    addTable?: {
        rows: TableRow[];
        options: TableProps;
    };
    /**
     * Add a text object to slide(s) created during autopaging
     */
    addText?: {
        text: TextProps[];
        options: TextPropsOptions;
    };
    /**
     * Whether to enable auto-paging
     * - auto-paging creates new slides as content overflows a slide
     * @default true
     */
    autoPage?: boolean;
    /**
     * Auto-paging character weight
     * - adjusts how many characters are used before lines wrap
     * - range: -1.0 to 1.0
     * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
     * @default 0.0
     * @example 0.5 // lines are longer (increases the number of characters that can fit on a given line)
     */
    autoPageCharWeight?: number;
    /**
     * Auto-paging line weight
     * - adjusts how many lines are used before slides wrap
     * - range: -1.0 to 1.0
     * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
     * @default 0.0
     * @example 0.5 // tables are taller (increases the number of lines that can fit on a given slide)
     */
    autoPageLineWeight?: number;
    /**
     * Whether to repeat head row(s) on new tables created by autopaging
     * @since v3.3.0
     * @default false
     */
    autoPageRepeatHeader?: boolean;
    /**
     * The `y` location to use on subsequent slides created by autopaging
     * @default (top margin of Slide)
     */
    autoPageSlideStartY?: number;
    /**
     * Column widths (inches)
     */
    colW?: number | number[];
    /**
     * Master slide name
     * - define a master slide to have your auto-paged slides have corporate design, etc.
     * @see https://gitbrent.github.io/PptxGenJS/docs/masters.html
     */
    masterSlideName?: string;
    /**
     * Slide margin
     * - this margin will be across all slides created by auto-paging
     */
    slideMargin?: Margin;
    /**
     * @deprecated v3.3.0 - use `autoPageRepeatHeader`
     */
    addHeaderToEach?: boolean;
    /**
     * @deprecated v3.3.0 - use `autoPageSlideStartY`
     */
    newSlideStartY?: number;
}
export interface TableCellProps extends TextBaseProps {
    /**
     * Auto-paging character weight
     * - adjusts how many characters are used before lines wrap
     * - range: -1.0 to 1.0
     * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
     * @default 0.0
     * @example 0.5 // lines are longer (increases the number of characters that can fit on a given line)
     */
    autoPageCharWeight?: number;
    /**
     * Auto-paging line weight
     * - adjusts how many lines are used before slides wrap
     * - range: -1.0 to 1.0
     * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
     * @default 0.0
     * @example 0.5 // tables are taller (increases the number of lines that can fit on a given slide)
     */
    autoPageLineWeight?: number;
    /**
     * Cell border
     */
    border?: BorderProps | [BorderProps, BorderProps, BorderProps, BorderProps];
    /**
     * Cell colspan
     */
    colspan?: number;
    /**
     * Fill color
     * @example { color:'FF0000' } // hex color (red)
     * @example { color:'0088CC', colorConfig:{} } // hex color, 50% opacity
     * @example { color:pptx.SchemeColor.accent1 } // theme color Accent1
     */
    fill?: ColorSelection;
    hyperlink?: HyperlinkProps;
    /**
     * Cell margin (inches)
     * @default 0
     */
    margin?: Margin;
    /**
     * Cell rowspan
     */
    rowspan?: number;
}
export interface TableProps extends PositionProps, TextBaseProps, ObjectNameProps {
    _arrObjTabHeadRows?: TableRow[];
    /**
     * Whether to enable auto-paging
     * - auto-paging creates new slides as content overflows a slide
     * @default false
     */
    autoPage?: boolean;
    /**
     * Auto-paging character weight
     * - adjusts how many characters are used before lines wrap
     * - range: -1.0 to 1.0
     * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
     * @default 0.0
     * @example 0.5 // lines are longer (increases the number of characters that can fit on a given line)
     */
    autoPageCharWeight?: number;
    /**
     * Auto-paging line weight
     * - adjusts how many lines are used before slides wrap
     * - range: -1.0 to 1.0
     * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
     * @default 0.0
     * @example 0.5 // tables are taller (increases the number of lines that can fit on a given slide)
     */
    autoPageLineWeight?: number;
    /**
     * Whether table header row(s) should be repeated on each new slide creating by autoPage.
     * Use `autoPageHeaderRows` to designate how many rows comprise the table header (1+).
     * @default false
     * @since v3.3.0
     */
    autoPageRepeatHeader?: boolean;
    /**
     * Number of rows that comprise table headers
     * - required when `autoPageRepeatHeader` is set to true.
     * @example 2 - repeats the first two table rows on each new slide created
     * @default 1
     * @since v3.3.0
     */
    autoPageHeaderRows?: number;
    /**
     * The `y` location to use on subsequent slides created by autopaging
     * @default (top margin of Slide)
     */
    autoPageSlideStartY?: number;
    /**
     * Table border
     * - single value is applied to all 4 sides
     * - array of values in TRBL order for individual sides
     */
    border?: BorderProps | [BorderProps, BorderProps, BorderProps, BorderProps];
    /**
     * Width of table columns (inches)
     * - single value is applied to every column equally based upon `w`
     * - array of values in applied to each column in order
     * @default columns of equal width based upon `w`
     */
    colW?: number | number[];
    /**
     * Cell background color
     * @example { color:'FF0000' } // hex color (red)
     * @example { color:'0088CC', colorConfig:{} } // hex color, 50% opacity
     * @example { color:pptx.SchemeColor.accent1 } // theme color Accent1
     */
    fill?: ColorSelection;
    /**
     * Cell margin (inches)
     * - affects all table cells, is superceded by cell options
     */
    margin?: Margin;
    /**
     * Height of table rows (inches)
     * - single value is applied to every row equally based upon `h`
     * - array of values in applied to each row in order
     * @default rows of equal height based upon `h`
     */
    rowH?: number | number[];
    /**
     * DEV TOOL: Verbose Mode (to console)
     * - tell the library to provide an almost ridiculous amount of detail during auto-paging calculations
     * @default false // obviously
     */
    verbose?: boolean;
    /**
     * @deprecated v3.3.0 - use `autoPageSlideStartY`
     */
    newSlideStartY?: number;
}
export interface TableCell {
    _type: SLIDE_OBJECT_TYPES.tablecell;
    /** lines in this cell (autoPage) */
    _lines?: TableCell[][];
    /** `text` prop but guaranteed to hold "TableCell[]" */
    _tableCells?: TableCell[];
    /** height in EMU */
    _lineHeight?: number;
    _hmerge?: boolean;
    _vmerge?: boolean;
    _rowContinue?: number;
    _optImp?: any;
    text?: string | TableCell[];
    options?: TableCellProps;
}
export interface TableRowSlide {
    rows: TableRow[];
}
export type TableRow = TableCell[];
export interface TextGlowProps {
    /**
     * Border color (hex format)
     * @example 'FF3399'
     */
    color?: HexColor;
    /**
     * opacity (0.0 - 1.0)
     * @example 0.5
     * 50% opaque
     */
    opacity?: number;
    /**
     * size (points)
     */
    size: number;
}
export interface TextPropsOptions extends PositionProps, DataOrPathProps, TextBaseProps, ObjectNameProps {
    _bodyProp?: {
        autoFit?: boolean;
        align?: TEXT_HALIGN;
        anchor?: TEXT_VALIGN;
        lIns?: number;
        rIns?: number;
        tIns?: number;
        bIns?: number;
        vert?: 'eaVert' | 'horz' | 'mongolianVert' | 'vert' | 'vert270' | 'wordArtVert' | 'wordArtVertRtl';
        wrap?: boolean;
    };
    _lineIdx?: number;
    baseline?: number;
    /**
     * Character spacing
     */
    charSpacing?: number;
    /**
     * Text fit options
     *
     * MS-PPT > Format Shape > Shape Options > Text Box > "[unlabeled group]": [3 options below]
     * - 'none' = Do not Autofit
     * - 'shrink' = Shrink text on overflow
     * - 'resize' = Resize shape to fit text
     *
     * **Note** 'shrink' and 'resize' only take effect after editing text/resize shape.
     * Both PowerPoint and Word dynamically calculate a scaling factor and apply it when edit/resize occurs.
     *
     * There is no way for this library to trigger that behavior, sorry.
     * @since v3.3.0
     * @default "none"
     */
    fit?: 'none' | 'shrink' | 'resize';
    /**
     * Shape fill
     * @example { color:'FF0000' } // hex color (red)
     * @example { color:'0088CC', colorConfig:{} } // hex color,
     * @example { color:pptx.SchemeColor.accent1 } // theme color Accent1
     */
    fill?: ColorSelection;
    /**
     * Flip shape horizontally?
     * @default false
     */
    flipH?: boolean;
    /**
     * Flip shape vertical?
     * @default false
     */
    flipV?: boolean;
    glow?: TextGlowProps;
    hyperlink?: HyperlinkProps;
    indentLevel?: number;
    isTextBox?: boolean;
    line?: ShapeLineProps;
    /**
     * Line spacing (pt)
     * - PowerPoint: Paragraph > Indents and Spacing > Line Spacing: > "Exactly"
     * @example 28 // 28pt
     */
    lineSpacing?: number;
    /**
     * line spacing multiple (percent)
     * - range: 0.0-9.99
     * - PowerPoint: Paragraph > Indents and Spacing > Line Spacing: > "Multiple"
     * @example 1.5 // 1.5X line spacing
     * @since v3.5.0
     */
    lineSpacingMultiple?: number;
    /**
     * Margin (points)
     * - PowerPoint: Format Shape > Shape Options > Size & Properties > Text Box > Left/Right/Top/Bottom margin
     * @default "Normal" margin in PowerPoint [3.5, 7.0, 3.5, 7.0] // (this library sets no value, but PowerPoint defaults to "Normal" [0.05", 0.1", 0.05", 0.1"])
     * @example 0 // Top/Right/Bottom/Left margin 0 [0.0" in powerpoint]
     * @example 10 // Top/Right/Bottom/Left margin 10 [0.14" in powerpoint]
     * @example [10,5,10,5] // Top margin 10, Right margin 5, Bottom margin 10, Left margin 5
     */
    margin?: Margin;
    outline?: {
        size: number;
        color: ColorSelection;
    };
    paraSpaceAfter?: number;
    paraSpaceBefore?: number;
    placeholder?: string;
    /**
     * Rotation (degrees)
     * - range: -360 to 360
     * @default 0
     * @example 180 // rotate 180 degrees
     */
    rotate?: number;
    /**
     * Whether to enable right-to-left mode
     * @default false
     */
    rtlMode?: boolean;
    shadow?: ShadowProps;
    shape?: SHAPE_NAME;
    strike?: boolean | 'dblStrike' | 'sngStrike';
    subscript?: boolean;
    superscript?: boolean;
    /**
     * Vertical alignment
     * @default middle
     */
    valign?: VAlign;
    vert?: 'eaVert' | 'horz' | 'mongolianVert' | 'vert' | 'vert270' | 'wordArtVert' | 'wordArtVertRtl';
    /**
     * Text wrap
     * @since v3.3.0
     * @default true
     */
    wrap?: boolean;
    /**
     * Whether "Fit to Shape?" is enabled
     * @deprecated v3.3.0 - use `fit`
     */
    autoFit?: boolean;
    /**
     * Whather "Shrink Text on Overflow?" is enabled
     * @deprecated v3.3.0 - use `fit`
     */
    shrinkText?: boolean;
    /**
     * Inset
     * @deprecated v3.10.0 - use `margin`
     */
    inset?: number;
    /**
     * Dash type
     * @deprecated v3.3.0 - use `line.dashType`
     */
    lineDash?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot';
    /**
     * @deprecated v3.3.0 - use `line.beginArrowType`
     */
    lineHead?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle';
    /**
     * @deprecated v3.3.0 - use `line.width`
     */
    lineSize?: number;
    /**
     * @deprecated v3.3.0 - use `line.endArrowType`
     */
    lineTail?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle';
}
export interface TextProps {
    text?: string;
    options?: TextPropsOptions;
}
export type ChartAxisTickMark = 'none' | 'inside' | 'outside' | 'cross';
export type ChartLineCap = 'flat' | 'round' | 'square';
export interface OptsChartData {
    _dataIndex?: number;
    /**
     * category labels
     * @example ['Year 2000', 'Year 2010', 'Year 2020'] // single-level category axes labels
     * @example [['Year 2000', 'Year 2010', 'Year 2020'], ['Decades', '', '']] // multi-level category axes labels
     * @since `labels` string[][] type added v3.11.0
     */
    labels?: string[] | string[][];
    /**
     * series name
     * @example 'Locations'
     */
    name?: string;
    /**
     * bubble sizes
     * @example [5, 1, 5, 1]
     */
    sizes?: number[];
    /**
     * category values
     * @example [2000, 2010, 2020]
     */
    values?: number[];
}
export interface IOptsChartData extends OptsChartData {
    labels?: string[][];
}
export interface OptsChartGridLine {
    /**
     * MS-PPT > Chart format > Format Major Gridlines > Line > Cap type
     * - line cap type
     * @default flat
     */
    cap?: ChartLineCap;
    /**
     * Gridline color (hex)
     * @example 'FF3399'
     */
    color?: HexColor;
    /**
     * Gridline size (points)
     */
    size?: number;
    /**
     * Gridline style
     */
    style?: 'solid' | 'dash' | 'dot' | 'none';
}
export interface IChartMulti {
    type: CHART_NAME;
    data: IOptsChartData[];
    options: IChartOptsLib;
}
export interface IChartPropsFillLine {
    /**
     * PowerPoint: Format Chart Area/Plot > Border ["Line"]
     * @example border: {color: 'FF0000', pt: 1} // hex RGB color, 1 pt line
     */
    border?: BorderProps;
    /**
     * PowerPoint: Format Chart Area/Plot Area > Fill
     * @example fill: {color: '696969'} // hex RGB color value
     * @example fill: {color: pptx.SchemeColor.background2} // Theme color value
     * @example fill: {configColor: 50} // 50% configColor
     */
    fill?: ColorSelection;
}
export interface IChartAreaProps extends IChartPropsFillLine {
    /**
     * Whether the chart area has rounded corners
     * - only applies when either `fill` or `border` is used
     * @default true
     * @since v3.11
     */
    roundedCorners?: boolean;
}
export interface IChartPropsBase {
    /**
     * Axis position
     */
    axisPos?: 'b' | 'l' | 'r' | 't';
    chartColors?: HexColor[];
    /**
     * opacity (0 - 100)
     * @example 50 // 50% opaque
     */
    chartColorsOpacity?: number;
    dataBorder?: BorderProps;
    displayBlanksAs?: string;
    invertedColors?: HexColor[];
    lang?: string;
    layout?: PositionProps;
    shadow?: ShadowProps;
    /**
     * @default false
     */
    showLabel?: boolean;
    showLeaderLines?: boolean;
    /**
     * @default false
     */
    showLegend?: boolean;
    /**
     * @default false
     */
    showPercent?: boolean;
    /**
     * @default false
     */
    showSerName?: boolean;
    /**
     * @default false
     */
    showTitle?: boolean;
    /**
     * @default false
     */
    showValue?: boolean;
    /**
     * 3D Perspecitve
     * - range: 0-120
     * @default 30
     */
    v3DPerspective?: number;
    /**
     * Right Angle Axes
     * - Shows chart from first-person perspective
     * - Overrides `v3DPerspective` when true
     * - PowerPoint: Chart Options > 3-D Rotation
     * @default false
     */
    v3DRAngAx?: boolean;
    /**
     * X Rotation
     * - PowerPoint: Chart Options > 3-D Rotation
     * - range: 0-359.9
     * @default 30
     */
    v3DRotX?: number;
    /**
     * Y Rotation
     * - range: 0-359.9
     * @default 30
     */
    v3DRotY?: number;
    /**
     * PowerPoint: Format Chart Area (Fill & Border/Line)
     * @since v3.11
     */
    chartArea?: IChartAreaProps;
    /**
     * PowerPoint: Format Plot Area (Fill & Border/Line)
     * @since v3.11
     */
    plotArea?: IChartPropsFillLine;
    /**
     * @deprecated v3.11.0 - use `plotArea.border`
     */
    border?: BorderProps;
    /**
     * @deprecated v3.11.0 - use `plotArea.fill`
     */
    fill?: HexColor;
}
export interface IChartPropsAxisCat {
    /**
     * Multi-Chart prop: array of cat axes
     */
    catAxes?: IChartPropsAxisCat[];
    catAxisBaseTimeUnit?: string;
    catAxisCrossesAt?: number | 'autoZero';
    catAxisHidden?: boolean;
    catAxisLabelColor?: string;
    catAxisLabelFontBold?: boolean;
    catAxisLabelFontFace?: string;
    catAxisLabelFontItalic?: boolean;
    catAxisLabelFontSize?: number;
    catAxisLabelFrequency?: string;
    catAxisLabelPos?: 'none' | 'low' | 'high' | 'nextTo';
    catAxisLabelRotate?: number;
    catAxisLineColor?: string;
    catAxisLineShow?: boolean;
    catAxisLineSize?: number;
    catAxisLineStyle?: 'solid' | 'dash' | 'dot';
    catAxisMajorTickMark?: ChartAxisTickMark;
    catAxisMajorTimeUnit?: string;
    catAxisMajorUnit?: number;
    catAxisMaxVal?: number;
    catAxisMinorTickMark?: ChartAxisTickMark;
    catAxisMinorTimeUnit?: string;
    catAxisMinorUnit?: number;
    catAxisMinVal?: number;
    /** @since v3.11.0 */
    catAxisMultiLevelLabels?: boolean;
    catAxisOrientation?: 'minMax';
    catAxisTitle?: string;
    catAxisTitleColor?: string;
    catAxisTitleFontFace?: string;
    catAxisTitleFontSize?: number;
    catAxisTitleRotate?: number;
    catGridLine?: OptsChartGridLine;
    catLabelFormatCode?: string;
    /**
     * Whether data should use secondary category axis (instead of primary)
     * @default false
     */
    secondaryCatAxis?: boolean;
    showCatAxisTitle?: boolean;
}
export interface IChartPropsAxisSer {
    serAxisBaseTimeUnit?: string;
    serAxisHidden?: boolean;
    serAxisLabelColor?: string;
    serAxisLabelFontBold?: boolean;
    serAxisLabelFontFace?: string;
    serAxisLabelFontItalic?: boolean;
    serAxisLabelFontSize?: number;
    serAxisLabelFrequency?: string;
    serAxisLabelPos?: 'none' | 'low' | 'high' | 'nextTo';
    serAxisLineColor?: string;
    serAxisLineShow?: boolean;
    serAxisMajorTimeUnit?: string;
    serAxisMajorUnit?: number;
    serAxisMinorTimeUnit?: string;
    serAxisMinorUnit?: number;
    serAxisOrientation?: string;
    serAxisTitle?: string;
    serAxisTitleColor?: string;
    serAxisTitleFontFace?: string;
    serAxisTitleFontSize?: number;
    serAxisTitleRotate?: number;
    serGridLine?: OptsChartGridLine;
    serLabelFormatCode?: string;
    showSerAxisTitle?: boolean;
}
export interface IChartPropsAxisVal {
    /**
     * Whether data should use secondary value axis (instead of primary)
     * @default false
     */
    secondaryValAxis?: boolean;
    showValAxisTitle?: boolean;
    /**
     * Multi-Chart prop: array of val axes
     */
    valAxes?: IChartPropsAxisVal[];
    valAxisCrossesAt?: number | 'autoZero';
    valAxisDisplayUnit?: 'billions' | 'hundredMillions' | 'hundreds' | 'hundredThousands' | 'millions' | 'tenMillions' | 'tenThousands' | 'thousands' | 'trillions';
    valAxisDisplayUnitLabel?: boolean;
    valAxisHidden?: boolean;
    valAxisLabelColor?: string;
    valAxisLabelFontBold?: boolean;
    valAxisLabelFontFace?: string;
    valAxisLabelFontItalic?: boolean;
    valAxisLabelFontSize?: number;
    valAxisLabelFormatCode?: string;
    valAxisLabelPos?: 'none' | 'low' | 'high' | 'nextTo';
    valAxisLabelRotate?: number;
    valAxisLineColor?: string;
    valAxisLineShow?: boolean;
    valAxisLineSize?: number;
    valAxisLineStyle?: 'solid' | 'dash' | 'dot';
    /**
     * PowerPoint: Format Axis > Axis Options > Logarithmic scale - Base
     * - range: 2-99
     * @since v3.5.0
     */
    valAxisLogScaleBase?: number;
    valAxisMajorTickMark?: ChartAxisTickMark;
    valAxisMajorUnit?: number;
    valAxisMaxVal?: number;
    valAxisMinorTickMark?: ChartAxisTickMark;
    valAxisMinVal?: number;
    valAxisOrientation?: 'minMax';
    valAxisTitle?: string;
    valAxisTitleColor?: string;
    valAxisTitleFontFace?: string;
    valAxisTitleFontSize?: number;
    valAxisTitleRotate?: number;
    valGridLine?: OptsChartGridLine;
    /**
     * Value label format code
     * - this also directs Data Table formatting
     * @since v3.3.0
     * @example '#%' // round percent
     * @example '0.00%' // shows values as '0.00%'
     * @example '$0.00' // shows values as '$0.00'
     */
    valLabelFormatCode?: string;
}
export interface IChartPropsChartBar {
    bar3DShape?: string;
    barDir?: string;
    barGapDepthPct?: number;
    /**
     * MS-PPT > Format chart > Format Data Point > Series Options >  "Gap Width"
     * - width (percent)
     * - range: `0`-`500`
     * @default 150
     */
    barGapWidthPct?: number;
    barGrouping?: string;
    /**
     * MS-PPT > Format chart > Format Data Point > Series Options >  "Series Overlap"
     * - overlap (percent)
     * - range: `-100`-`100`
     * @since v3.9.0
     * @default 0
     */
    barOverlapPct?: number;
}
export interface IChartPropsChartDoughnut {
    dataNoEffects?: boolean;
    holeSize?: number;
}
export interface IChartPropsChartLine {
    /**
     * MS-PPT > Chart format > Format Data Series > Line > Cap type
     * - line cap type
     * @default flat
     */
    lineCap?: ChartLineCap;
    /**
     * MS-PPT > Chart format > Format Data Series > Marker Options > Built-in > Type
     * - line dash type
     * @default solid
     */
    lineDash?: 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'solid' | 'sysDash' | 'sysDot';
    /**
     * MS-PPT > Chart format > Format Data Series > Marker Options > Built-in > Type
     * - marker type
     * @default circle
     */
    lineDataSymbol?: 'circle' | 'dash' | 'diamond' | 'dot' | 'none' | 'square' | 'triangle';
    /**
     * MS-PPT > Chart format > Format Data Series > [Marker Options] > Border > Color
     * - border color
     * @default circle
     */
    lineDataSymbolLineColor?: string;
    /**
     * MS-PPT > Chart format > Format Data Series > [Marker Options] > Border > Width
     * - border width (points)
     * @default 0.75
     */
    lineDataSymbolLineSize?: number;
    /**
     * MS-PPT > Chart format > Format Data Series > Marker Options > Built-in > Size
     * - marker size
     * - range: 2-72
     * @default 6
     */
    lineDataSymbolSize?: number;
    /**
     * MS-PPT > Chart format > Format Data Series > Line > Width
     * - line width (points)
     * - range: 0-1584
     * @default 2
     */
    lineSize?: number;
    /**
     * MS-PPT > Chart format > Format Data Series > Line > Smoothed line
     * - "Smoothed line"
     * @default false
     */
    lineSmooth?: boolean;
}
export interface IChartPropsChartPie {
    dataNoEffects?: boolean;
    /**
     * MS-PPT > Format chart > Format Data Series > Series Options >  "Angle of first slice"
     * - angle (degrees)
     * - range: 0-359
     * @since v3.4.0
     * @default 0
     */
    firstSliceAng?: number;
}
export interface IChartPropsChartRadar {
    /**
     * MS-PPT > Chart Type > Waterfall
     * - radar chart type
     * @default standard
     */
    radarStyle?: 'standard' | 'marker' | 'filled';
}
export interface IChartPropsDataLabel {
    dataLabelBkgrdColors?: boolean;
    dataLabelColor?: string;
    dataLabelFontBold?: boolean;
    dataLabelFontFace?: string;
    dataLabelFontItalic?: boolean;
    dataLabelFontSize?: number;
    /**
     * Data label format code
     * @example '#%' // round percent
     * @example '0.00%' // shows values as '0.00%'
     * @example '$0.00' // shows values as '$0.00'
     */
    dataLabelFormatCode?: string;
    dataLabelFormatScatter?: 'custom' | 'customXY' | 'XY';
    dataLabelPosition?: 'b' | 'bestFit' | 'ctr' | 'l' | 'r' | 't' | 'inEnd' | 'outEnd';
}
export interface IChartPropsDataTable {
    dataTableFontSize?: number;
    /**
     * Data table format code
     * @since v3.3.0
     * @example '#%' // round percent
     * @example '0.00%' // shows values as '0.00%'
     * @example '$0.00' // shows values as '$0.00'
     */
    dataTableFormatCode?: string;
    /**
     * Whether to show a data table adjacent to the chart
     * @default false
     */
    showDataTable?: boolean;
    showDataTableHorzBorder?: boolean;
    showDataTableKeys?: boolean;
    showDataTableOutline?: boolean;
    showDataTableVertBorder?: boolean;
}
export interface IChartPropsLegend {
    legendColor?: string;
    legendFontFace?: string;
    legendFontSize?: number;
    legendPos?: 'b' | 'l' | 'r' | 't' | 'tr';
}
export interface IChartPropsTitle extends TextBaseProps {
    title?: string;
    titleAlign?: string;
    titleBold?: boolean;
    titleColor?: string;
    titleFontFace?: string;
    titleFontSize?: number;
    titlePos?: {
        x: number;
        y: number;
    };
    titleRotate?: number;
}
export interface IChartOpts extends IChartPropsAxisCat, IChartPropsAxisSer, IChartPropsAxisVal, IChartPropsBase, IChartPropsChartBar, IChartPropsChartDoughnut, IChartPropsChartLine, IChartPropsChartPie, IChartPropsChartRadar, IChartPropsDataLabel, IChartPropsDataTable, IChartPropsLegend, IChartPropsTitle, ObjectNameProps, OptsChartGridLine, PositionProps {
    /**
     * Alt Text value ("How would you describe this object and its contents to someone who is blind?")
     * - PowerPoint: [right-click on a chart] > "Edit Alt Text..."
     */
    altText?: string;
}
export interface IChartOptsLib extends IChartOpts {
    _type?: CHART_NAME | IChartMulti[];
}
export interface ISlideRelChart extends OptsChartData {
    type: CHART_NAME | IChartMulti[];
    opts: IChartOptsLib;
    data: IOptsChartData[];
    rId: number;
    Target: string;
    globalId: number;
    fileName: string;
}
export interface ISlideRel {
    type: SLIDE_OBJECT_TYPES;
    Target: string;
    fileName?: string;
    data: any[] | string;
    opts?: IChartOpts;
    path?: string;
    extn?: string;
    globalId?: number;
    rId: number;
}
export interface ISlideRelMedia {
    type: string;
    opts?: MediaProps;
    path?: string;
    extn?: string;
    data?: string | ArrayBuffer;
    /** used to indicate that a media file has already been read/enocded (PERF) */
    isDuplicate?: boolean;
    isSvgPng?: boolean;
    svgSize?: {
        w: number;
        h: number;
    };
    rId: number;
    Target: string;
}
export interface ISlideObject {
    _type: SLIDE_OBJECT_TYPES;
    options?: ObjectOptions;
    text?: TextProps[];
    arrTabRows?: TableCell[][];
    chartRid?: number;
    image?: string;
    imageRid?: number;
    hyperlink?: HyperlinkProps;
    media?: string;
    mtype?: MediaType;
    mediaRid?: number;
    shape?: SHAPE_NAME;
}
export interface WriteBaseProps {
    /**
     * Whether to compress export (can save substantial space, but takes a bit longer to export)
     * @default false
     * @since v3.5.0
     */
    compression?: boolean;
}
export interface WriteProps extends WriteBaseProps {
    /**
     * Output type
     * - values: 'arraybuffer' | 'base64' | 'binarystring' | 'blob' | 'nodebuffer' | 'uint8array' | 'STREAM'
     * @default 'blob'
     */
    outputType?: WRITE_OUTPUT_TYPE;
}
export interface WriteFileProps extends WriteBaseProps {
    /**
     * Export file name
     * @default 'Presentation.pptx'
     */
    fileName?: string;
}
export interface SectionProps {
    _type: 'user' | 'default';
    _slides: PresSlide[];
    /**
     * Section title
     */
    title: string;
    /**
     * Section order - uses to add section at any index
     * - values: 1-n
     */
    order?: number;
}
export interface PresLayout {
    _sizeW?: number;
    _sizeH?: number;
    /**
     * Layout Name
     * @example 'LAYOUT_WIDE'
     */
    name: string;
    width: number;
    height: number;
}
export interface SlideNumberProps extends PositionProps, TextBaseProps {
    /**
     * margin (points)
     */
    margin?: Margin;
}
export interface TextElementOptions {
    type: ElementType.text;
    arguments: Parameters<PresSlide['addText']>;
}
export interface ChartElementOptions {
    type: ElementType.chart;
    arguments: Parameters<PresSlide['addChart']>;
}
export interface ImageElementOptions {
    type: ElementType.image;
    arguments: Parameters<PresSlide['addImage']>;
}
export interface MediaElementOptions {
    type: ElementType.media;
    arguments: Parameters<PresSlide['addMedia']>;
}
export interface ShapeElementOptions {
    type: ElementType.shape;
    arguments: Parameters<PresSlide['addShape']>;
}
export interface GroupElementOptions {
    type: ElementType.startGroup;
    arguments: Parameters<PresSlide['startGroup']>;
}
export interface SlideElementOptions {
    type: ElementType.endGroup;
    arguments: Parameters<PresSlide['endGroup']>;
}
export type ElementOptions = TextElementOptions | ChartElementOptions | ImageElementOptions | MediaElementOptions | ShapeElementOptions | GroupElementOptions | SlideElementOptions;
export interface SlideMasterProps {
    /**
     * Unique name for this master
     */
    title: string;
    background?: BackgroundProps;
    margin?: Margin;
    slideNumber?: SlideNumberProps;
    elements: ElementOptions[];
    /**
     * @deprecated v3.3.0 - use `background`
     */
    bkgd?: string | BackgroundProps;
}
export interface ObjectOptions extends ImageProps, PositionProps, ShapeProps, TableCellProps, TextPropsOptions {
    _placeholderIdx?: number;
    _placeholderType?: PLACEHOLDER_TYPE;
    cx?: Coord;
    cy?: Coord;
    margin?: Margin;
    colW?: number | number[];
    rowH?: number | number[];
}
export interface SlideBaseProps {
    _bkgdImgRid?: number;
    _margin?: Margin;
    _name?: string;
    _presLayout: PresLayout;
    _rels: ISlideRel[];
    _relsChart: ISlideRelChart[];
    _relsMedia: ISlideRelMedia[];
    _slideNum: number;
    _slideNumberProps?: SlideNumberProps;
    _slideObjects?: ISlideObject[];
    background?: BackgroundProps;
    /**
     * @deprecated v3.3.0 - use `background`
     */
    bkgd?: string | BackgroundProps;
}
export interface SlideLayout extends SlideBaseProps {
    _slide?: {
        _bkgdImgRid?: number;
        back: string;
        color: string;
        hidden?: boolean;
    };
}
type TransitionDirection = 'l' | 'r' | 'u' | 'd';
type TransitionOrientation = 'vert' | 'horz';
type TransitionSpokes = 2 | 3 | 4 | 8;
interface BaseTransition {
    type: string;
}
interface FadeTransition extends BaseTransition {
    type: 'fade';
}
interface PushTransition extends BaseTransition {
    type: 'push';
    dir: TransitionDirection;
}
interface WipeTransition extends BaseTransition {
    type: 'wipe';
    dir: TransitionDirection;
}
interface SplitTransition extends BaseTransition {
    type: 'split';
    orient: TransitionOrientation;
    dir: 'in' | 'out';
}
interface BlindsTransition extends BaseTransition {
    type: 'blinds';
    dir: TransitionOrientation;
}
interface CheckerTransition extends BaseTransition {
    type: 'checker';
    dir: TransitionOrientation;
}
interface RandomTransition extends BaseTransition {
    type: 'random';
}
interface WheelTransition extends BaseTransition {
    type: 'wheel';
    spokes: TransitionSpokes;
}
interface CutTransition extends BaseTransition {
    type: 'cut';
}
interface CoverTransition extends BaseTransition {
    type: 'cover';
    dir: TransitionDirection;
}
interface PageCurlTransition extends BaseTransition {
    type: 'pageCurl';
    dir: TransitionDirection;
}
interface HoneycombTransition extends BaseTransition {
    type: 'honeycomb';
}
interface FractureTransition extends BaseTransition {
    type: 'fracture';
}
interface CombTransition extends BaseTransition {
    type: 'comb';
    dir: TransitionOrientation;
}
interface PrestigeTransition extends BaseTransition {
    type: 'prestige';
}
interface ShapeTransition extends BaseTransition {
    type: 'shape';
}
export type SlideTransition = FadeTransition | PushTransition | WipeTransition | SplitTransition | BlindsTransition | CheckerTransition | RandomTransition | WheelTransition | CutTransition | CoverTransition | PageCurlTransition | HoneycombTransition | FractureTransition | CombTransition | PrestigeTransition | ShapeTransition;
export interface PresSlide extends SlideBaseProps {
    _rId: number;
    _slideLayout: SlideLayout;
    _slideId: number;
    addChart: (type: CHART_NAME | IChartMulti[], data: IOptsChartData[], options?: IChartOpts) => PresSlide;
    addImage: (options: ImageProps) => PresSlide;
    addMedia: (options: MediaProps) => PresSlide;
    addNotes: (notes: string) => PresSlide;
    addShape: (shapeName: SHAPE_NAME, options?: ShapeProps) => PresSlide;
    addTable: (tableRows: TableRow[], options?: TableProps) => PresSlide;
    addText: (text: string | TextProps[], options?: TextPropsOptions) => PresSlide;
    startGroup: (options?: GroupProps) => PresSlide;
    endGroup: () => PresSlide;
    /**
     * Background color or image (`color` | `path` | `data`)
     * @example { color: 'FF3399' } - hex color
     * @example { color: 'FF3399', colorConfig:{} } - hex color
     * @example { path: 'https://onedrives.com/myimg.png` } - retrieve image via URL
     * @example { path: '/home/gitbrent/images/myimg.png` } - retrieve image via local path
     * @example { data: 'image/png;base64,iVtDaDrF[...]=' } - base64 string
     * @since v3.3.0
     */
    background?: BackgroundProps;
    /**
     * Default text color (hex format)
     * @example 'FF3399'
     * @default '000000' (DEF_FONT_COLOR)
     */
    color?: HexColor;
    /**
     * Whether slide is hidden
     * @default false
     */
    hidden?: boolean;
    /**
     * Slide number options
     */
    slideNumber?: SlideNumberProps;
    /**
     * Transition options
     */
    transition?: SlideTransition;
}
export interface AddSlideProps {
    masterName?: string;
    sectionTitle?: string;
}
export interface PresentationProps {
    author: string;
    company: string;
    layout: string;
    masterSlide: PresSlide;
    /**
     * Presentation's layout
     * read-only
     */
    presLayout: PresLayout;
    revision: string;
    /**
     * Whether to enable right-to-left mode
     * @default false
     */
    rtlMode: boolean;
    subject: string;
    theme: ThemeProps;
    title: string;
}
export interface IPresentationProps extends PresentationProps {
    sections: SectionProps[];
    slideLayouts: SlideLayout[];
    slides: PresSlide[];
}
export {};
