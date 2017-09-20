<h1>Tabledump</h1>
<table>
<?php
if (is_array($this->data)) {
    echo '<h2>Total: '.$this->data['count'].'</h2>';
foreach  ($this->data['results'] as $row) {
?>
    <tr>
<?php
    foreach ($row as $key => $value) {
        ?>
        <td><?= $value; ?></td>
        
    <?php }

?>        
    </tr>
<?php
}}

?>
</table>