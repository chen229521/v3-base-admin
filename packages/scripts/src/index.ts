import cac from 'cac'
import { blue, lightGreen } from 'kolorist'
import { version } from '../package.json'
import {
    cleanup,
    genChangelog,
    generateRoute,
    gitCommit,
    gitCommitVerify,
    release,
    updatePkg
} from './commands'
import { loadCliOptions } from './config'
import type { Lang } from './locales'

// 定义命令类型
type Command =
    | 'cleanup'
    | 'update-pkg'
    | 'git-commit'
    | 'git-commit-verify'
    | 'changelog'
    | 'release'
    | 'gen-route'

// 定义命令动作函数类型
type CommandAction<A extends object> = (args?: A) => Promise<void> | void

// 定义带有动作的命令类型
type CommandWithAction<A extends object = object> = Record<
    Command,
    { desc: string; action: CommandAction<A> }
>

// 定义命令参数接口
interface CommandArg {
    /** 在版本提升后和提交前执行的额外命令，默认为 'pnpm sa changelog' */
    execute?: string
    /** 是否推送 Git 提交和标签，默认为 true */
    push?: boolean
    /** 按总标签生成变更日志 */
    total?: boolean
    /**
     * 要清理的目录的 glob 模式
     *
     * 如果未设置，将使用默认值
     *
     * 多个值用逗号分隔
     */
    cleanupDir?: string
    /**
     * CLI 显示的语言
     *
     * @default 'en-us'
     */
    lang?: Lang
}

/**
 * 设置 CLI（命令行界面）
 *
 * 此函数初始化并配置 CLI，定义可用命令及其操作。
 */
export async function setupCli() {
    // 加载 CLI 配置选项
    const cliOptions = await loadCliOptions()

    // 初始化 CLI 并设置自定义名称
    const cli = cac(blue('prb'))

    // 配置 CLI 选项和帮助信息
    cli.version(lightGreen(version))
        .option(
            '-e, --execute [command]',
            "在版本提升后和提交前执行的额外命令，默认为 'npx soy changelog'"
        )
        .option('-p, --push', '是否推送 Git 提交和标签')
        .option('-t, --total', '按总标签生成变更日志')
        .option(
            '-c, --cleanupDir <dir>',
            '要清理的目录的 glob 模式，如果未设置，将使用默认值，多个值用逗号分隔'
        )
        .option('-l, --lang <lang>', 'CLI 显示的语言', {
            default: 'en-us',
            type: [String]
        })
        .help()

    // 定义命令及其操作
    const commands: CommandWithAction<CommandArg> = {
        cleanup: {
            desc: '删除目录：node_modules, dist 等',
            action: async () => {
                await cleanup(cliOptions.cleanupDirs)
            }
        },
        'update-pkg': {
            desc: '更新 package.json 依赖版本',
            action: async () => {
                await updatePkg(cliOptions.ncuCommandArgs)
            }
        },
        'git-commit': {
            desc: 'Git 提交，生成符合常规提交标准的提交消息',
            action: async (args) => {
                await gitCommit(args?.lang)
            }
        },
        'git-commit-verify': {
            desc: '验证 Git 提交消息，确保其符合常规提交标准',
            action: async (args) => {
                await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores)
            }
        },
        changelog: {
            desc: '生成变更日志',
            action: async (args) => {
                await genChangelog(cliOptions.changelogOptions, args?.total)
            }
        },
        release: {
            desc: '发布：更新版本，生成变更日志，提交代码',
            action: async (args) => {
                await release(args?.execute, args?.push)
            }
        },
        'gen-route': {
            desc: '生成路由',
            action: async () => {
                await generateRoute()
            }
        }
    }

    // 注册命令及其描述和动作
    for (const [command, { desc, action }] of Object.entries(commands)) {
        cli.command(command, lightGreen(desc)).action(action)
    }

    // 解析 CLI 命令
    cli.parse()
}

// 执行 CLI 设置
setupCli()
