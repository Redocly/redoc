---
title: Redoc CSS Guide
---

# Custom CSS Overrides Guide

Certain components and containers in this project have been given unique classNames to allow for easier CSS overriding.

## List of Unique ClassNames

### Operations

 - `middle-panel`: top level container for content in the middle panel of an **Operation**
 - `right-panel`: top level container for content in the right panel of an **Operation**
 - `operation-header`: `<h2>` that contains the **Operation** header/summary
 - `operation-description`: container for the **Operation** description

### Security

 - `operation-security`: top level container for the Security/Auth section in an **Operation**
 - `security-details`: container for an individual security method in the Security/Auth section

### Parameters
 - `operation-parameters`: container for **Operation** query/path/header/form parameters

### Requests

 - `operation-request-samples`: top level container for the **Request Samples** section in the right panel
 - `request-code-sample`: container for the request code samples in the right panel
 - `request-payload`: container for the request payload sample in the right panel

### Responses

 - `operation-responses`: top level container for the **Responses** section in the middle panel
 - `response`: container for individual responses in the **Responses** section
 - `response-headers`: `<tbody>` for response headers for an individual response
 - `operation-response-samples`: top level container for the **Response Samples** section in the right panel
 - `response-sample`: container for the response payload sample in the right panel

### Callbacks

 - `callbacks`: top level container for the **Callbacks** section in the middle panel
 - `callback`: container for individual callbacks in the **Callbacks** section
 - `operation-callback-samples`: top level container for the **Callback Samples** section in the right panel
 - `callback-sample`: container for the callback payload sample in the right panel

### Schemas

 - `array-schema`: container for array schema
 - `object-schema`: `<tbody>` for object schema
 - `oneOf-schema`: container for oneOf schema
 - `recursive-schema` container for recursive schema

### Fields

 - `field`: `<tr>` for individual fields inside a **Schema**
 - `field-details`: container for details on an individual **Field**
 - `field-constraints`: `<span>` for constraints on an individual **Field** inside the field details
 - `field-deprecated`: deprecated badge for an individual **Field** inside the field details
 - `field-example`: example value for an individual **Field** inside the field details
 - `field-pattern`: regex pattern for an individual **Field** inside the field details

### Other

 - `side-menu`: top level container for the sidebar menu
 - `endpoint`: container for the endpoint URL used in multiple places
 - `request-body-description`: container for the description of a request body used in multiple places
