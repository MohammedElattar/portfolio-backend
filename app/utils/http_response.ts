import HttpStatus from '../enums/http_status.js'
import ResponseHelper from './response_helper.js'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import CustomModel from '#models/utils/custom_model'

type DataType = any
type ResponsePropsType = {
    data: DataType
    message: string
    status: HttpStatus
}

export const validationErrorsResponse = (
    data: Record<string, string>,
    message: string = 'validation_errors'
) => {
    return errorResponse(data, message, HttpStatus.UNPROCESSABLE_ENTITY, 'E_VALIDATION_ERRORS')
}

export const forbiddenResponse = (props: Partial<ResponsePropsType> = {}) => {
    const { data = null, message = 'Access denied' } = props

    return errorResponse(data, message, HttpStatus.FORBIDDEN)
}

export const notFoundResponse = (props: Partial<ResponsePropsType> = {}) => {
    const { data = null, message = 'Could not found the requested resource' } = props

    return errorResponse(data, message, HttpStatus.NOT_FOUND)
}

export const okResponse = (props: Partial<ResponsePropsType> = {}) => {
    const { data = null, message = 'Operation made successfully' } = props
    return successResponse(data, message)
}

export const createdResponse = (props: Partial<ResponsePropsType> = {}) => {
    const {
        data = null,
        message = 'Resource created successfully',
        status = HttpStatus.CREATED,
    } = props
    return successResponse(data, message, status)
}

export const successResponse = (
    data: DataType = [],
    message: string = 'Success',
    status: number = HttpStatus.OK
) => {
    return baseResponse(data, message, status)
}

export const resourceResponse = (
    data: DataType = [],
    message: string = 'Data Fetched Successfully',
    status: number = HttpStatus.OK
) => {
    return baseResponse(data, message, status)
}

export const paginatedResponse = async <Model extends CustomModel>(
    paginator: ModelPaginatorContract<Model>,
    resource: any
) => {
    // @ts-ignore
    const data: DataType = await resource.collection(paginator.all())
    const meta = {
        from: paginator.getMeta().currentPage * paginator.getMeta().perPage,
        current_page: paginator.getMeta().currentPage,
        last_page: paginator.getMeta().lastPage,
        total: paginator.getMeta().total,
    }

    return baseResponse(data, 'Data fetched successfully', 200, undefined, { meta })
}

export const errorResponse = (
    data: DataType = [],
    message: string = 'Error Occurred',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string
) => {
    return baseResponse(data, message, status, code)
}

const baseResponse = (
    data: DataType = [],
    message: string,
    status: number,
    code?: string,
    additional?: any
) => {
    return ResponseHelper.get()
        .status(status)
        .send({
            data,
            ...additional,
            message,
            code: status,
            ...(code !== undefined ? { error_code: code } : {}),
        })
}
