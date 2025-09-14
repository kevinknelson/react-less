# react-less
The sheer amount of boilerplate/wiring I was doing was driving me nuts. So, I put together this project so that I could much more rapidly get the simple CRUD operations out of the way and focus on bigger things.

This has not been fully tested in any meaningful way, but it should work out of the box using json-server file packaged in here for testing without the need to setup a full environment.

#### use at your own risk.

## Basic Usage
### Step 1 - Setup Model to generate hooks
```javascript
export interface Group extends IRestModel {
    name            : string,
    score           : number,
    createdDateTime : DateTimeString,
    owner           : string,
}

export const GroupApi = RestApi.createApi<Group, Group>(`${api}/groups`)
    .makeHooks();
```

### Step 2 - Setup List with useGetAll hook
```javascript
  const apiResponse = GroupApi.useGetAll();

  if( apiResponse?.isSuccess && apiResponse?.payload?.length == 0 ) return <p>No groups found.</p>

  const groupList = apiResponse?.payload ?? null;

  return <>...your HTML...</>
```

### Step 3 - Setup your form with a useForm hook
```javascript
    const form      = useForm<Group>(GroupApi, GroupFormMapper, GroupValidation, id, returnUrl);

    <Form onSubmit={form.handleSubmit}>
        ....
        <FormInput onChange={form.handleChange} onBlur={form.handleBlur} ...rest />
        ...
    </Form>
```
