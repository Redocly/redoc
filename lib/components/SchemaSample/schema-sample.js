'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var OpenAPISampler = require('openapi-sampler');
var base_1 = require('../base');
var JsonFormatterPipe_1 = require('../../utils/JsonFormatterPipe');
var SchemaSample = (function (_super) {
    __extends(SchemaSample, _super);
    function SchemaSample(schemaMgr, elementRef) {
        _super.call(this, schemaMgr);
        this.element = elementRef.nativeElement;
    }
    SchemaSample.prototype.init = function () {
        this.data = {};
        var base = {};
        var sample;
        if (this.componentSchema.schema) {
            base = this.componentSchema;
            this.componentSchema = this.componentSchema.schema;
        }
        if (base.examples && base.examples['application/json']) {
            sample = base.examples['application/json'];
        }
        else {
            this.dereference(this.componentSchema);
            try {
                sample = OpenAPISampler.sample(this.componentSchema);
            }
            catch (e) {
            }
        }
        this.data.sample = sample;
        this.element.addEventListener('click', function (event) {
            var collapsed, target = event.target;
            if (event.target.className === 'collapser') {
                collapsed = target.parentNode.getElementsByClassName('collapsible')[0];
                if (collapsed.parentNode.classList.contains('collapsed')) {
                    collapsed.parentNode.classList.remove('collapsed');
                }
                else {
                    collapsed.parentNode.classList.add('collapsed');
                }
            }
        });
    };
    SchemaSample = __decorate([
        base_1.RedocComponent({
            selector: 'schema-sample',
            templateUrl: './schema-sample.html',
            pipes: [JsonFormatterPipe_1.JsonFormatter],
            styleUrls: ['./schema-sample.css']
        }), 
        __metadata('design:paramtypes', [base_1.SchemaManager, core_1.ElementRef])
    ], SchemaSample);
    return SchemaSample;
}(base_1.BaseComponent));
exports.SchemaSample = SchemaSample;
