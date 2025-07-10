import os
import platform
import subprocess


# 根据操作系统获取 git 仓库的 URL
def get_git_url(user_repo):
    os_name = platform.system()
    # if os_name == "Windows":
    if True == True:
        # 如果是 Windows，使用 HTTPS URL
        return "https://github.com/" + user_repo + ".git"
    else:
        # 否则，使用 SSH URL
        return "git@github.com:" + user_repo + ".git"


# 运行 git 命令并返回输出
def run_git_command(command):
    try:
        command_str = " ".join(command)
        result = subprocess.run(
            command_str, check=True, capture_output=True, text=True, shell=True
        )
        print(command_str, result.stdout)  # 打印命令的输出
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Git 命令执行失败: {' '.join(command)}")
        print(f"输出: {e.output}")
        return None


def get_remote_name(user_repo):
    return user_repo.replace("/", "-")


# 检查远程仓库是否存在
def remote_exists(remote_name):
    remotes = run_git_command(["git", "remote"])
    return remote_name in remotes.splitlines()


# 将 user_repo 的代码合并到当前仓库
def merge_with_log(user_repo):
    remote_name = get_remote_name(user_repo)
    # 先尝试移除远程，如果它存在的话
    if remote_exists(remote_name):
        remove_remote_command = ["git", "remote", "remove", remote_name]
        run_git_command(remove_remote_command)
    # 添加一个新的远程
    add_remote_command = ["git", "remote", "add", remote_name, get_git_url(user_repo)]
    # 如果添加远程失败，停止执行
    if run_git_command(add_remote_command) is None:
        print(f"添加远程 {remote_name} 失败。")
        return
    # 获取远程的数据
    fetch_command = ["git", "fetch", remote_name]
    # 如果获取数据失败，停止执行
    if run_git_command(fetch_command) is None:
        print(f"获取 {remote_name} 的数据失败。")
        return
    # 尝试合并远程的 main 分支
    merge_command = ["git", "merge", remote_name + "/master"]
    # 尝试合并
    merge_output = run_git_command(merge_command)
    if merge_output is None:
        # 如果合并失败，输出错误信息
        print("合并失败。请解决冲突后再试。")
    else:
        # 如果合并成功，输出合并的输出
        print("合并成功。输出:")
        print(merge_output)


merge_with_log("mx-space/core")
