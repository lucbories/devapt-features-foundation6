
// NPM IMPORTS
import _ from 'lodash'
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const plugin_name = 'Foundation6' 
const context = plugin_name + '/rendering_function/block_grid_dock_item'



// DEFAULT STATE
const default_state = {
	label:undefined,
	items:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined/*,
	small_size_count:1,
	medium_size_count:2,
	large_size_count:3*/
}



/**
 * Block Grid dock item rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined

	// GET SETTINGS ATTRIBUTES
	settings.class = settings.class ? settings.class : ''
	const tag_dock_id = settings.id

	// DEBUG
	console.log('block-grid-dock-item rendering call for %s', tag_dock_id)

	// HEADER OPTIONS
	const settings_has_config = T.isBoolean(settings.has_config) ? settings.has_config : true
	const settings_has_help   = T.isBoolean(settings.has_help) ? settings.has_help : true
	const settings_has_expand = T.isBoolean(settings.has_expand) ? settings.has_expand : true
	const settings_has_close  = T.isBoolean(settings.has_close) ? settings.has_close : true

	// GET STATE ATTRIBUTES
	const items_value   = T.isArray(state.items) ? state.items : undefined

	// DOCK ITEM HEADER BUILDER
	const item_header_fn = (item_id)=>{
		// const tag_header_resize_img = h('img', {src:'assets/img/fullscreen.png'}, undefined)
		const tag_header_config_img = '#' // ❔' // ❕❓❗
		const tag_header_config_style = {
			'float':'right',
			'font-site':'0.8em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_header_config_props = { style:tag_header_config_style, className:'devapt-dock-button-settings', 'data-devapt-item-id':item_id }
		const tag_header_config = h('button', tag_header_config_props, [ h('span', undefined, [h('span', undefined, [tag_header_config_img])] ) ])
		
		const tag_header_help_img = '?' // ❔' // ❕❓❗
		const tag_header_help_style = {
			'float':'right',
			'font-site':'0.8em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_header_help_props = { style:tag_header_help_style, className:'devapt-dock-button-help', 'data-devapt-item-id':item_id }
		const tag_header_help = h('button', tag_header_help_props, [ h('span', undefined, [h('span', undefined, [tag_header_help_img])] ) ])

		const tag_header_resize_img = '⧉' // ‾
		const tag_header_resize_style = {
			'float':'right',
			'font-site':'0.8em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_header_resize_props = { style:tag_header_resize_style, className:'devapt-dock-button-resize', 'data-devapt-item-id':item_id }
		const tag_header_resize = h('button', tag_header_resize_props, [ h('span', undefined, [h('span', undefined, [tag_header_resize_img])] ) ])
		
		const tag_header_close_img = '×' // html entity "&times;" not x
		const tag_content_close_style = {
			'float':'right',
			'font-site':'1.2em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_content_close_props = { style:tag_content_close_style, className:'devapt-dock-button-close', 'data-devapt-item-id':item_id }
		const tag_content_close = h('button', tag_content_close_props, [ h('span', undefined, [h('span', undefined, [tag_header_close_img])] ) ])
		
		const tag_header_buttons_children = []
		if (settings_has_close)
		{
			tag_header_buttons_children.push(tag_content_close)
		}
		if (settings_has_expand)
		{
			tag_header_buttons_children.push(tag_header_resize)
		}
		if (settings_has_help)
		{
			tag_header_buttons_children.push(tag_header_help)
		}
		if (settings_has_config)
		{
			tag_header_buttons_children.push(tag_header_config)
		}

		const tag_header_buttons_props = { style:'height:20px;' }
		const tag_header_buttons = h('span', tag_header_buttons_props, tag_header_buttons_children)

		const tag_header_id = item_id + '_header'
		const tag_header_children = [tag_header_buttons]
		const tag_header_style = {
			'padding-top':'2px',
			'padding-bottom':'2px',
			'margin-top':'2px',
			'margin-bottom':'2px'
		}
		const tag_header_props = { id:tag_header_id, className:'devapt-dock-item-header', style:tag_header_style }
		return h('div', tag_header_props, tag_header_children )
	}

	// DOCK ITEM CONTENT BUILDER
	const item_content_fn = (item_name)=>{
		return T.isFunction(rendering_factory) ? rendering_factory(item_name, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : item_desc.toString()
	}

	// DOCK ITEM BUILDER
	const cell_fn = (cell) => {
		const cell_id = T.isString(cell.view) ? cell.view : ( (cell && cell.settings && cell.settings.id) ? cell.settings.id : undefined)
		if (! cell_id)
		{
			console.error(context + ':cell_fn:bad dock item id for ', cell)
			return undefined
		}
		const item_style = {
			'border':'2px solid grey',
			'margin-bottom':'2px'
		}
		const tag_props = { id:cell_id, style:item_style, className:'column column-block devapt-dock-item' }
		
		const header_vnode = item_header_fn(cell_id)
		const items_vnodes = items_value.map(item_content_fn)
		const tags_children = _.concat([header_vnode], items_vnodes)
		return h('div', tag_props, tags_children)
	}
	
	// BUILD DOCK ITEM
	const tag_dock_item = cell_fn( { view:tag_dock_id } )

	rendering_result.add_vtree(tag_dock_id, tag_dock_item)

	const js_block_grid_dock = `
		window.devapt().on_content_rendered(
			function()
			{
				console.log('on_content_rendered:button.devapt-dock-button init for %s', "${tag_dock_id}")

				// RESIZE BUTTON
				var resize_button = $("button.devapt-dock-button-resize", "#${tag_dock_id}");
				resize_button.click(
					function(e)
					{
						var id = this['data-devapt-item-id']
						console.log('resize_button for %s', id, $(e.target))

						if (id)
						{
							window.devapt().ui(id).show()
							window.devapt().ui(id).toggle_from_fullscreen()
						}

						return false
					}
				)
				
				// CLOSE BUTTON
				var close_button = $("button.devapt-dock-button-close", "#${tag_dock_id}");
				close_button.click(
					function(e)
					{
						var id = this['data-devapt-item-id']
						console.log('close_button for %s', id, $(e.target))

						if (id)
						{
							window.devapt().ui(id).toggle()
						}

						return false
					}
				)
				
				// HELP BUTTON
				var help_button = $("button.devapt-dock-button-close", "#${tag_dock_id}");
				help_button.click(
					function(e)
					{
						var id = this['data-devapt-item-help']
						console.log('help_button for %s', id, $(e.target))
						if (id)
						{
							window.devapt().ui(id).show()
						}

						return false
					}
				)
				
				// SETTINGS BUTTON
				var settings_button = $("button.devapt-dock-button-settings", "#${tag_dock_id}");
				settings_button.click(
					function(e)
					{
						var id = this['data-devapt-item-settings']
						console.log('settings_button for %s', id, $(e.target))
						if (id)
						{
							window.devapt().ui(id).show()
						}

						return false
					}
				)
			},
			undefined,
			true
		)`
	
	rendering_result.add_body_scripts_tags(
		[
			{
				id:'js-foundation-block-grid-dock-' + tag_dock_id,
				content:js_block_grid_dock
			}
		]
	)
	
	rendering_result.add_head_styles_tags(
		[
			{
				id:'css-foundation-block-grid-dock',
				content:`
div.devapt-dock-item:hover {
	border:'4px solid black;'
}`,
				media:'all'
			}
		]
	)

	return rendering_result
}
