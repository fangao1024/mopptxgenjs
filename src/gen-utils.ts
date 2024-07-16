/**
 * PptxGenJS: Utility Methods
 */

import { EMU, REGEX_HEX_COLOR, DEF_FONT_COLOR, ONEPT, SchemeColor, SCHEME_COLORS, SHAPE_NAME } from './core-enums'
import {
	PresLayout,
	TextGlowProps,
	PresSlide,
	Color,
	Coord,
	ShadowProps,
	ColorSelection,
	ColorConfig,
	GradFillColor,
	SolidFillColor,
	BlipFillColor,
	ShapeLineProps,
	ShapePath,
	SlideLayout
} from './core-interfaces'

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
export function getSmartParseNumber(size: number): number
export function getSmartParseNumber(size: Coord, xyDir: 'X' | 'Y', layout: PresLayout): number
export function getSmartParseNumber(size: Coord, xyDir?: 'X' | 'Y', layout?: PresLayout): number {
	// FIRST: Convert string numeric value if reqd
	if (typeof size === 'string' && !isNaN(Number(size))) size = Number(size)

	// CASE 1: Number in inches
	// Assume any number less than 100 is inches
	// 这里没有考虑负数 暂时规定英寸的取值范围为 (-100,100)
	if (typeof size === 'number' && (size < 100 || size > -100)) {
		return inch2Emu(size)
	}

	// CASE 2: Percentage (ex: '50%')
	if (typeof size === 'string' && size.includes('%')) {
		if (xyDir && xyDir === 'X') return Math.round((parseFloat(size) / 100) * layout.width)
		if (xyDir && xyDir === 'Y') return Math.round((parseFloat(size) / 100) * layout.height)

		// Default: Assume width (x/cx)
		return Math.round((parseFloat(size) / 100) * layout.width)
	}

	// LAST: Default value
	return 0
}

/**
 * Basic UUID Generator Adapted
 * @link https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
 * @param {string} uuidFormat - UUID format
 * @returns {string} UUID
 */
export function getUuid(uuidFormat: string): string {
	return uuidFormat.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}
/**
 * 是否是空值
 * @param value 值
 * @returns 是否是空值
 */
export function isNil(value: any): value is null | undefined {
	return value === null || value === undefined
}

/**
 * Replace special XML characters with HTML-encoded strings
 * @param {string} xml - XML string to encode
 * @returns {string} escaped XML
 */
export function encodeXmlEntities(xml: string): string {
	// NOTE: Dont use short-circuit eval here as value c/b "0" (zero) etc.!
	if (typeof xml === 'undefined' || xml == null) return ''
	return xml.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/**
 * Convert inches into EMU 这里不在兼容 emu单位 全面使用英寸单位
 * @param {number|string} inches - as string or number
 * @returns {number} EMU value
 */
export function inch2Emu(inches: number | string): number {
	if (typeof inches === 'string') inches = Number(inches.replace(/in*/gi, ''))
	return Math.round(EMU * inches)
}

/**
 *  Convert `pt` into points (using `ONEPT`)
 * @param {number|string} pt
 * @returns {number} value in points (`ONEPT`)
 */
export function valToPts(pt: number | string): number {
	const points = Number(pt) || 0
	return isNaN(points) ? 0 : Math.round(points * ONEPT)
}

/**
 * Convert degrees (0..360) to PowerPoint `rot` value
 * @param {number} d degrees
 * @returns {number} calculated `rot` value
 */
export function convertRotationDegrees(d: number): number {
	d = d || 0
	return Math.round((d > 360 ? d - 360 : d) * 60000)
}

/**
 * Converts component value to hex value
 * @param {number} c - component color
 * @returns {string} hex string
 */
export function componentToHex(c: number): string {
	const hex = c.toString(16)
	return hex.length === 1 ? '0' + hex : hex
}

/**
 * Converts RGB colors from css selectors to Hex for Presentation colors
 * @param {number} r - red value
 * @param {number} g - green value
 * @param {number} b - blue value
 * @returns {string} XML string
 */
export function rgbToHex(r: number, g: number, b: number): string {
	return (componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase()
}

/**
 * 获取URL的文件类型
 * @param url url链接
 * @param defaultType 默认类型
 * @returns  文件类型
 */
export function getURLType(url: string, defaultType: string = 'png'): string {
	if (!url) {
		console.warn('getURLType error: urlType set defaultType is png', `error url : ${url}`)
		return defaultType
	}
	// 补充协议头
	if (!url.startsWith('http') && url.startsWith('//')) {
		url = 'https:' + url
	}
	try {
		const urlObject = new URL(url)
		const pathname: string = urlObject.pathname
		const match = pathname.match(/\.(\w+)$/)
		if (match) {
			return match[1].toLowerCase()
		} else {
			console.warn('getURLType error: urlType set defaultType is png', `error url : ${url}`)
			return defaultType
		}
	} catch (error) {
		console.warn('getURLType error: urlType set defaultType is png', `error url : ${url}`, error)
		return defaultType
	}
}
/**
 * 获取base64的文件类型
 * @param base64 base64字符串
 * @param defaultType 默认类型
 * @returns 文件类型
 */
export function getBase64Type(base64: string, defaultType: string = 'png') {
	let strImgExtn = defaultType
	if (base64 && /image\/(\w+);/.exec(base64) && /image\/(\w+);/.exec(base64).length > 0) {
		strImgExtn = /image\/(\w+);/.exec(base64)[1]
	} else if (base64?.toLowerCase().includes('image/svg+xml')) {
		strImgExtn = 'svg'
	}
	return strImgExtn
}

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
export function createColorElement(colorStr: string | SCHEME_COLORS, innerElements?: string): string {
	let colorVal = (colorStr || '').replace('#', '')

	if (
		!REGEX_HEX_COLOR.test(colorVal) &&
		colorVal !== SchemeColor.background1 &&
		colorVal !== SchemeColor.background2 &&
		colorVal !== SchemeColor.text1 &&
		colorVal !== SchemeColor.text2 &&
		colorVal !== SchemeColor.accent1 &&
		colorVal !== SchemeColor.accent2 &&
		colorVal !== SchemeColor.accent3 &&
		colorVal !== SchemeColor.accent4 &&
		colorVal !== SchemeColor.accent5 &&
		colorVal !== SchemeColor.accent6 &&
		colorVal !== SchemeColor.folHlink &&
		colorVal !== SchemeColor.hlink &&
		colorVal !== SchemeColor.dk1 &&
		colorVal !== SchemeColor.lt1 &&
		colorVal !== SchemeColor.dk2 &&
		colorVal !== SchemeColor.lt2
	) {
		console.warn(`"${colorVal}" is not a valid scheme color or hex RGB! "${DEF_FONT_COLOR}" used instead. Only provide 6-digit RGB or 'pptx.SchemeColor' values!`)
		colorVal = DEF_FONT_COLOR
	}

	const tagName = REGEX_HEX_COLOR.test(colorVal) ? 'srgbClr' : 'schemeClr'
	const colorAttr = 'val="' + (REGEX_HEX_COLOR.test(colorVal) ? colorVal.toUpperCase() : colorVal) + '"'

	return innerElements ? `<a:${tagName} ${colorAttr}>${innerElements}</a:${tagName}>` : `<a:${tagName} ${colorAttr}/>`
}

/**
 * Creates `a:glow` element
 * @param {TextGlowProps} options glow properties
 * @param {TextGlowProps} defaults defaults for unspecified properties in `opts`
 * @see http://officeopenxml.com/drwSp-effects.php
 * { size: 8, color: 'FFFFFF', opacity: 0.75 };
 */
export function createGlowElement(options: TextGlowProps, defaults: TextGlowProps): string {
	let strXml = ''
	const opts = { ...defaults, ...options }
	const size = Math.round(opts.size * ONEPT)
	const color = opts.color
	const opacity = Math.round(opts.opacity * 100000)

	strXml += `<a:glow rad="${size}">`
	strXml += createColorElement(color, `<a:alpha val="${opacity}"/>`)
	strXml += '</a:glow>'

	return strXml
}
/**
 * 获取颜色配置项元素
 * @param {ColorConfig} colorConfig
 * @returns {string} elements XML
 */
export function createColorConfigElement(colorConfig?: ColorConfig): string {
	let elements = ''
	if (colorConfig) {
		if (!isNil(colorConfig.alpha)) {
			elements += `<a:alpha val="${Math.round(colorConfig.alpha * 1000)}"/>`
		}
		if (!isNil(colorConfig.hueMod)) {
			elements += `<a:hueMod val="${Math.round(colorConfig.hueMod * 1000)}"/>`
		}
		if (!isNil(colorConfig.lumMod)) {
			elements += `<a:lumMod val="${Math.round(colorConfig.lumMod * 1000)}"/>`
		}
		if (!isNil(colorConfig.lumOff)) {
			elements += `<a:lumOff val="${Math.round(colorConfig.lumOff * 1000)}"/>`
		}
		if (!isNil(colorConfig.satMod)) {
			elements += `<a:satMod val="${Math.round(colorConfig.satMod * 1000)}"/>`
		}
		if (!isNil(colorConfig.satOff)) {
			elements += `<a:satOff val="${Math.round(colorConfig.satOff * 1000)}"/>`
		}
		if (!isNil(colorConfig.shade)) {
			elements += `<a:shade val="${Math.round(colorConfig.shade * 1000)}"/>`
		}
		if (!isNil(colorConfig.tint)) {
			elements += `<a:tint val="${Math.round(colorConfig.tint * 1000)}"/>`
		}
	}
	return elements
}

/**
 * 创建实色填充
 * @param {SolidFillColor} options 实色填充参数
 */
export function createSolidFillElement(options: SolidFillColor) {
	return `<a:solidFill>${createColorElement(options.color, createColorConfigElement(options.colorConfig))}</a:solidFill>`
}
/**
 * 创建渐变填充
 * @param {GradFillColor} options 渐变填充参数
 */
export function createGradFillElement(options: GradFillColor) {
	const { gradientStopList, gradientType, flip, rotWithShape } = options
	let element = ''
	element += `<a:gradFill flip="${flip}" rotWithShape="${rotWithShape ? '1' : '0'}">`
	if (gradientStopList.length > 0) {
		element += `<a:gsLst>`
		element += gradientStopList
			.map((stop) => `<a:gs pos="${Math.round(stop.pos * 1000)}">${createColorElement(stop.color.color, createColorConfigElement(stop.color.colorConfig))}</a:gs>`)
			.join('')
		element += `</a:gsLst>`
	}
	switch (gradientType) {
		case 'linear': {
			const rot = options?.gradientProps?.rot || 0
			element += `<a:lin ang="${convertRotationDegrees(rot)}" scaled="0"/>`
			break
		}
		case 'radial': {
			const top = options?.gradientProps?.top || 0
			const left = options?.gradientProps.left || 0
			const bottom = options?.gradientProps.bottom || 0
			const right = options?.gradientProps.right || 0
			const type = options?.gradientProps.type || 'shape'
			element += `<a:path path="${type}"><a:fillToRect l="${left}" t="${top}" r="${right}" b="${bottom}"/></a:path>`
			break
		}
		default:
			break
	}
	element += '</a:gradFill>'

	return element
}

export function createBlipFillElement(options: BlipFillColor) {
	const { _rid, rotWithShape, alpha, tiling, stretchProps, tileProps } = options
	let element = ''
	element += `<a:blipFill rotWithShape="${rotWithShape ? '1' : '0'}">`
	element += `<a:blip r:embed="rId${_rid}">`
	element += `<a:alphaModFix amt="${Math.round(alpha * 1000)}"/>`
	element += `</a:blip>`
	if (tiling === 'stretch') {
		const { top, left, bottom, right } = stretchProps || {}
		element += `<a:stretch><a:fillRect`
		if (!isNil(top)) element += ` t="${Math.round(top * 1000)}"`
		if (!isNil(left)) element += ` l="${Math.round(left * 1000)}"`
		if (!isNil(bottom)) element += ` b="${Math.round(bottom * 1000)}"`
		if (!isNil(right)) element += ` r="${Math.round(right * 1000)}"`
		element += `/></a:stretch>`
	} else if (tiling === 'tile') {
		const { tx, ty, sx, sy, flip, algn } = tileProps || {}
		element += `<a:tile`
		if (!isNil(tx)) element += ` tx="${inch2Emu(tx)}"`
		if (!isNil(ty)) element += ` ty="${inch2Emu(ty)}"`
		if (!isNil(sx)) element += ` sx="${Math.round(sx * 1000)}"`
		if (!isNil(sy)) element += ` sy="${Math.round(sy * 1000)}"`
		if (!isNil(flip)) element += ` flip="${flip}"`
		if (!isNil(algn)) element += ` algn="${algn}"`
		element += '/>'
	}
	element += '</a:blipFill>'
	return element
}

/**
 * Create color selection
 * @param {Color | ColorSelection} props fill props
 * @returns XML string
 */
export function genXmlColorSelection(props: Color): string
export function genXmlColorSelection(props: ColorSelection): string
export function genXmlColorSelection(props: Color | ColorSelection): string {
	if (props) {
		const options: ColorSelection = typeof props === 'string' ? { type: 'solid', color: props } : props
		if (options) {
			switch (options.type) {
				case 'solid':
					return createSolidFillElement(options)
				case 'grad':
					return createGradFillElement(options)
				case 'blip':
					return createBlipFillElement(options)
				case 'none':
					return '<a:noFill/>'
				default:
					// @note need a statement as having only "break" is removed by rollup, then tiggers "no-default" js-linter
					return ''
			}
		}
	}
	return ''
}

/**
 * 初始化颜色选择 现阶段只有grad和blip需要初始化 为了方便统一处理 其他类型还是统一加入
 * @param {ColorSelection} options  颜色选择
 * @param {PresSlide} target 幻灯片 用于blip填充时需要传入
 * @returns {ColorSelection} 颜色选择
 */
export function initColorSelection(options: ColorSelection, target?: PresSlide): ColorSelection {
	switch (options.type) {
		case 'grad': {
			// 初始化渐变填充参数
			options.gradientStopList = options.gradientStopList ?? []
			options.gradientType = options.gradientType ?? 'linear'
			options.flip = options.flip ?? 'y'
			options.rotWithShape = options.rotWithShape ?? true
			break
		}
		case 'blip': {
			if (!target) {
				console.warn('blip填充需要传入target参数')
				return options
			}
			// 初始化图片填充参数
			options.rotWithShape = options.rotWithShape ?? true
			options.alpha = options.alpha ?? 100
			options.tiling = options.tiling ?? 'stretch'
			// 初始化图片填充参数
			const relId = getNewRelId(target)
			options._rid = options._rid ?? relId
			const { data, path } = options
			let strImgExtn = getURLType(path)
			if (data) {
				strImgExtn = getBase64Type(data)
			}
			const dupeItem = target._relsMedia.find((rel) => rel.path === path && rel.type === 'image/' + strImgExtn && !rel.isDuplicate)
			target._relsMedia.push({
				path: path || 'preencoded.' + strImgExtn,
				type: 'image/' + strImgExtn,
				extn: strImgExtn,
				data: data || '',
				rId: relId,
				isDuplicate: !!dupeItem?.Target,
				Target: dupeItem?.Target ? dupeItem.Target : `../media/image-${target._slideNum}-${target._relsMedia.length + 1}.${strImgExtn}`
			})
			break
		}
		case 'solid':
		case 'none':
		default:
			break
	}
	return options
}
/**
 * 生成线条元素
 * @param {ShapeLineProps} line  线条参数
 * @returns {string}  线条元素
 */
export function genLineElementXML(line: ShapeLineProps): string {
	let element = ''
	if (line) {
		element += '<a:ln'
		if (line.width) {
			element += ` w="${valToPts(line.width)}"`
		}
		if (line.capType) {
			element += ` cap="${line.capType}"`
		}
		if (line.joinType) {
			element += ` cmpd="${line.joinType}"`
		}
		element += '>'
		if (line.color) element += genXmlColorSelection(line.color)
		if (line.dashType) element += `<a:prstDash val="${line.dashType}"/>`
		if (line.beginArrowType) element += `<a:headEnd type="${line.beginArrowType}"/>`
		if (line.endArrowType) element += `<a:tailEnd type="${line.endArrowType}"/>`
		// FUTURE: `endArrowSize` < a: headEnd type = "arrow" w = "lg" len = "lg" /> 'sm' | 'med' | 'lg'(values are 1 - 9, making a 3x3 grid of w / len possibilities)
		element += '</a:ln>'
	}
	return element
}
/**
 * 生成几何形状元素
 * @param {SHAPE_NAME} name 几何形状名称
 * @param {Record<string, number>} options.path 几何形状路径
 * @param {ShapePath} options.adjusting 调整参数
 * @returns {string} 几何形状元素
 */
interface GeometryElementXMLOptions {
	adjusting?: Record<string, number>
	paths?: ShapePath[]
	slide?: PresSlide | SlideLayout
}
export function genGeometryElementXML(name: SHAPE_NAME = 'rect', { adjusting, paths, slide }: GeometryElementXMLOptions = {}): string {
	let element = ''
	if (name === 'custGeom') {
		element += '<a:custGeom><a:avLst />'
		element += '<a:gdLst>'
		element += '</a:gdLst>'
		element += '<a:ahLst />'
		element += '<a:cxnLst>'
		element += '</a:cxnLst>'
		element += '<a:rect l="l" t="t" r="r" b="b" />'
		element += '<a:pathLst>'
		for (const path of paths) {
			element += `<a:path w="${getSmartParseNumber(path?.w)}" h="${getSmartParseNumber(path?.h)}">`
			path?.paths.forEach((path) => {
				switch (path.type) {
					case 'moveTo':
						element += `<a:moveTo><a:pt x="${getSmartParseNumber(path.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(path.y, 'Y', slide._presLayout)}" /></a:moveTo>`
						break
					case 'lineTo':
						element += `<a:lnTo><a:pt x="${getSmartParseNumber(path.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(path.y, 'Y', slide._presLayout)}" /></a:lnTo>`
						break
					case 'arcTo':
						element += `<a:arcTo wR="${getSmartParseNumber(path.wR, 'X', slide._presLayout)}" hR="${getSmartParseNumber(path.hR, 'Y', slide._presLayout)}" stAng="${path.stAng}" swAng="${
							path.swAng
						}" />`
						break
					case 'cubicBezTo':
						element += `<a:cubicBezTo><a:pt x="${getSmartParseNumber(path.x1, 'X', slide._presLayout)}" y="${getSmartParseNumber(
							path.y1,
							'Y',
							slide._presLayout
						)}" /><a:pt x="${getSmartParseNumber(path.x2, 'X', slide._presLayout)}" y="${getSmartParseNumber(path.y2, 'Y', slide._presLayout)}" /><a:pt x="${getSmartParseNumber(
							path.x3,
							'X',
							slide._presLayout
						)}" y="${getSmartParseNumber(path.y3, 'Y', slide._presLayout)}" /></a:cubicBezTo>`
						break
					case 'quadBezTo':
						element += `<a:quadBezTo><a:pt x="${getSmartParseNumber(path.x1, 'X', slide._presLayout)}" y="${getSmartParseNumber(
							path.y1,
							'Y',
							slide._presLayout
						)}" /><a:pt x="${getSmartParseNumber(path.x2, 'X', slide._presLayout)}" y="${getSmartParseNumber(path.y2, 'Y', slide._presLayout)}" /></a:quadBezTo>`
						break
					case 'close':
						element += '<a:close />'
						break
				}
			})
			element += '</a:path>'
		}

		element += '</a:pathLst>'
		element += '</a:custGeom>'
	} else {
		const shapeAdjusting = adjusting
		element += '<a:prstGeom prst="' + name + '"><a:avLst>'
		if (shapeAdjusting && Object.keys(shapeAdjusting).length > 0) {
			Object.entries(shapeAdjusting).forEach(([key, value]) => {
				element += `<a:gd name="${key}" fmla="val ${getSmartParseNumber(value)}" />`
			})
		}
		element += '</a:avLst></a:prstGeom>'
	}
	return element
}

/**
 * Get a new rel ID (rId) for charts, media, etc.
 * @param {PresSlide} target - the slide to use
 * @returns {number} count of all current rels plus 1 for the caller to use as its "rId"
 */
export function getNewRelId(target: PresSlide): number {
	return target._rels.length + target._relsChart.length + target._relsMedia.length + 1
}

/**
 * Checks shadow options passed by user and performs corrections if needed.
 * @param {ShadowProps} ShadowProps - shadow options
 */
export function correctShadowOptions(ShadowProps: ShadowProps): ShadowProps | undefined {
	if (!ShadowProps || typeof ShadowProps !== 'object') {
		// console.warn("`shadow` options must be an object. Ex: `{shadow: {type:'none'}}`")
		return
	}

	// OPT: `type`
	if (ShadowProps.type !== 'outer' && ShadowProps.type !== 'inner' && ShadowProps.type !== 'none') {
		console.warn('Warning: shadow.type options are `outer`, `inner` or `none`.')
		ShadowProps.type = 'outer'
	}

	// OPT: `angle`
	if (ShadowProps.angle) {
		// A: REALITY-CHECK
		if (isNaN(Number(ShadowProps.angle)) || ShadowProps.angle < 0 || ShadowProps.angle > 359) {
			console.warn('Warning: shadow.angle can only be 0-359')
			ShadowProps.angle = 270
		}

		// B: ROBUST: Cast any type of valid arg to int: '12', 12.3, etc. -> 12
		ShadowProps.angle = Math.round(Number(ShadowProps.angle))
	}

	// OPT: `opacity`
	if (ShadowProps.opacity) {
		// A: REALITY-CHECK
		if (isNaN(Number(ShadowProps.opacity)) || ShadowProps.opacity < 0 || ShadowProps.opacity > 1) {
			console.warn('Warning: shadow.opacity can only be 0-1')
			ShadowProps.opacity = 0.75
		}

		// B: ROBUST: Cast any type of valid arg to int: '12', 12.3, etc. -> 12
		ShadowProps.opacity = Number(ShadowProps.opacity)
	}

	// OPT: `color`
	if (ShadowProps.color) {
		// INCORRECT FORMAT
		if (ShadowProps.color.startsWith('#')) {
			console.warn('Warning: shadow.color should not include hash (#) character, , e.g. "FF0000"')
			ShadowProps.color = ShadowProps.color.replace('#', '')
		}
	}

	return ShadowProps
}
