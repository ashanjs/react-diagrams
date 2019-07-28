import { BaseEntity, BaseEntityEvent, BaseEntityGenerics, BaseEntityListener, BaseEntityOptions } from './BaseEntity';
import { DiagramEngine } from '../DiagramEngine';

export interface BaseModelListener extends BaseEntityListener {
	selectionChanged?(event: BaseEntityEvent<BaseModel> & { isSelected: boolean }): void;

	entityRemoved?(event: BaseEntityEvent<BaseModel>): void;
}

export interface BaseModelOptions extends BaseEntityOptions {
	type?: string;
	selected?: boolean;
	extras?: any;
}

export interface BaseModelGenerics extends BaseEntityGenerics {
	LISTENER: BaseModelListener;
	PARENT: BaseEntity;
	OPTIONS: BaseModelOptions;
}

export class BaseModel<G extends BaseModelGenerics = BaseModelGenerics> extends BaseEntity<G> {
	protected parent: G['PARENT'];

	constructor(options: G['OPTIONS']) {
		super(options);
	}

	getParent(): G['PARENT'] {
		return this.parent;
	}

	setParent(parent: G['PARENT']) {
		this.parent = parent;
	}

	getSelectedEntities(): Array<BaseModel> {
		if (this.isSelected()) {
			return [this];
		}
		return [];
	}

	serialize() {
		return {
			...super.serialize(),
			type: this.options.type,
			selected: this.options.selected,
			extras: this.options.extras
		};
	}

	deSerialize(data: { [p: string]: any }, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.options.extras = data.extras;
		this.options.selected = data.selected;
	}

	getType(): string {
		return this.options.type;
	}

	isSelected(): boolean {
		return this.options.selected;
	}

	setSelected(selected: boolean = true) {
		this.options.selected = selected;

		this.fireEvent(
			{
				isSelected: selected
			},
			'selectionChanged'
		);
	}

	remove() {
		this.fireEvent({}, 'entityRemoved');
	}
}